import React from 'react';
import ImageUpload from '../containers/cont-imageUpload';
import AccessTest from '../containers/cont-accessTest';
const App = () => {
    return (
        <div>
          <h2>
            Upload Image
          </h2>
          <ImageUpload />
          <AccessTest />
        </div>
    );
};

export default App;
