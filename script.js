let inputStartPoint = document.getElementById('stratpoint')
let inputStep = document.getElementById('step')

let inputLayerHeight = document.getElementById('layerHeight')
let inputLayerDensity = document.getElementById('layerDensity')
let inputLayerPoisson = document.getElementById('layerPoisson')

let button = document.querySelector('.button-download')

let array = document.querySelector('.block-with-array')

let layerHeight = []
let layerDensity = []
let layerPoisson = []

let dataFormat = []
let parameterValue = []

inputLayerHeight.addEventListener('keydown', (event) => {
  if (event.code === 'Enter') {
    layerHeight.push(+inputLayerHeight.value)

    let nh = document.querySelector('.nh')
    if (!document.getElementsByClassName('addLayer')[+nh.innerHTML - 1]) {
      drawArray()
    }
    document.getElementsByClassName('addLayer')[+nh.innerHTML - 1].firstElementChild.innerHTML = `${nh.innerHTML}) h = ${inputLayerHeight.value} м `
    inputLayerHeight.value = ''
    nh.innerHTML = +nh.innerHTML + 1
  }
})

inputLayerDensity.addEventListener(('keydown'), (event) => {
  if (event.code === 'Enter') {
    layerDensity.push(+inputLayerDensity.value)

    let nd = document.querySelector('.nd')
    if (!document.getElementsByClassName('addLayer')[+nd.innerHTML - 1]) {
      drawArray()
    }

    document.getElementsByClassName('addLayer')[+nd.innerHTML - 1].children[1].innerHTML = `ρ = ${inputLayerDensity.value} кг/м<sup>3</sup> `
    inputLayerDensity.value = ''
    nd.innerHTML = +nd.innerHTML + 1
  }
})
inputLayerPoisson.addEventListener(('keydown'), (event) => {
  if (event.code === 'Enter') {
    layerPoisson.push(+inputLayerPoisson.value)

    let np = document.querySelector('.np')
    if (!document.getElementsByClassName('addLayer')[+np.innerHTML - 1]) {
      drawArray()
    }

    document.getElementsByClassName('addLayer')[+np.innerHTML - 1].children[2].innerHTML = `μ = ${inputLayerPoisson.value}`
    inputLayerPoisson.value = ''
    np.innerHTML = +np.innerHTML + 1
  }
})

function drawArray() {
  let spanHeight = document.createElement('span');
  let spanDensity = document.createElement('span');
  let spanPoisson = document.createElement('span');
  let div = document.createElement('div');
  div.classList.add('addLayer')
  div.append(spanHeight)
  div.append(spanDensity)
  div.append(spanPoisson)
  array.append(div)
}

function lateralPressure() {
  let startPoint = +inputStartPoint.value;
  let step = +inputStep.value;
  startPoint *= 10000;
  let g = 9.81;
  if (layerPoisson.length !== 0) {
    g = g * layerPoisson[f] / (1 - layerPoisson[f])
  }

  step *= 10000;
  layerHeight = layerHeight.map(l => l * 10000)

  let f = 0
  let i = startPoint;
  let hi = startPoint + layerHeight[f]

  let endPoint = startPoint
  layerHeight.forEach(l => endPoint += l)

  while (i <= endPoint) {
    if (i <= hi) {
      let p = layerDensity[f] * g * i / 10000
      p = p.toFixed(2)
      p = p.toString().replace('.', ',')
      //console.log(`${-i / 10000} ${p.toFixed(2)}`);
      if (p.toString().includes('.')) {
        dataFormat.push(`${p}`)
      } else {
        dataFormat.push(`${p}.`)
      }
      if (i.toString().includes('.')) {
        parameterValue.push(`${-i / 10000}`)
      } else {
        parameterValue.push(`${-i / 10000}.`)
      }
      i = i + step
    }
    else {
      f++;
      hi += layerHeight[f];
    }
  }
}
function download(a, b) {
  let text =
    `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
<ANSYS_EnggData>
	<MaterialData/>
	<ConvectionData/>
	<LoadVariationData>
		  <MatML_Doc>
			  <LoadVariation>
				    <BulkDetails>
					    <Name>Pressure</Name>
					    <Form>
						      <Description/>
					</Form>
					    <PropertyData property="pr1">
						      <Data format="float">${a}</Data>
						      <Qualifier>Pressure</Qualifier>
						      <ParameterValue format="float" parameter="pa1">${b}</ParameterValue>
					</PropertyData>
				</BulkDetails>
				    <Metadata>
					    <ParameterDetails id="pa1">
						      <Name>Y</Name>
					</ParameterDetails>
					    <PropertyDetails id="pr1">
						      <Name>Pressure</Name>
					</PropertyDetails>
				</Metadata>
			</LoadVariation>
		</MatML_Doc>
	</LoadVariationData>
	<BeamSectionData/>
</ANSYS_EnggData>
`;
  downloadAsFile(text);

  function downloadAsFile(data) {
    let a = document.createElement("a");
    let file = new Blob([data], { type: 'application/json' });
    a.href = URL.createObjectURL(file);
    a.download = "pressure.xml";
    a.click();
  }
}

button.addEventListener('click', () => {
  if (inputStartPoint.value === '') return
  if (inputStep === '') return
  if (layerHeight.length !== layerDensity.length) return
  if (layerDensity.length !== layerPoisson.length && layerPoisson.length !== 0) return
  lateralPressure()
  download(dataFormat.join(), parameterValue.join())
})
