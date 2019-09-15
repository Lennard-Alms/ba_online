import React from 'react';
import ImageUpload from '../containers/cont-imageUpload';
import AccessTest from '../containers/cont-accessTest';
import Output from '../containers/cont-output';

const App = () => {
    return (
        <div>
          <h2>
            Upload Image
          </h2>
          <ImageUpload />
          <AccessTest />
          <Output />
        
        </div>
    );
};

export default App;
