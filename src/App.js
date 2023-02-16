// ./src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import { computerVision, isConfigured as ComputerVisionIsConfigured } from './azure-cognitiveservices-computervision';

function App() {

  const [fileSelected, setFileSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  const handleChange = (e) => {
    setFileSelected(e.target.value)
  }
  const onFileUrlEntered = (e) => {

    // hold UI
    setProcessing(true);
    setAnalysis(null);

    computerVision(fileSelected || null).then((item) => {
      // reset state/form
      setAnalysis(item);
      setFileSelected("");
      setProcessing(false);
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      axios.get(analysis.URL).then((response) => {
        SVGTextPositioningElement(response.data);
      });
    }, []);

  };

  // Display JSON data in readable format
  const PrettyPrintJson = (data) => {
    return (<div><pre>{JSON.stringify(data, null, 2)}</pre></div>);
  }

  const DisplayResults = () => {
    return (
      <div>
        <h2>Computer Vision Analysis</h2>
        <div><img src={analysis.URL} height="200" border="1" alt={(analysis.description && analysis.description.captions && analysis.description.captions[0].text ? analysis.description.captions[0].text : "can't find caption")} /></div>
        {PrettyPrintJson(analysis)}
      </div>
    )
  };
  
  const Analyze = () => {
    return (
    <div>
      <h1 class="relative w-full flex-none mb-2 text-2xl font-semibold text-black">Analyze image</h1>
      {!processing &&
        <div>
          <div>
            <label>URL</label>
            <input type="text" placeholder="Enter URL or leave empty for random image from collection" size="50" onChange={handleChange}></input>
          </div>
          <button onClick={onFileUrlEntered}>Analyze</button>
        </div>
      }
      {processing && <div>Processing</div>}
      <hr />
      {analysis && DisplayResults()}
      </div>
    )
  }
  
  const CantAnalyze = () => {
    return (
      <div>Key and/or endpoint not configured in ./azure-cognitiveservices-computervision.js</div>
    )
  }
  
  function Render() {
    const ready = ComputerVisionIsConfigured();
    if (ready) {
      return <Analyze />;
    }
    return <CantAnalyze />;
  }

  return (
    <div>
      {Render()}
    </div>
    
  );
}

export default App;
