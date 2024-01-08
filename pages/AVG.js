import React, { useState, useEffect } from 'react';

const AVG = () => {
  const [average, setAverage] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch('../api/questioneerresult', {method:'GET'});
      const data = await response.json(); 
      setAverage(data.average);
    } catch (error) {
      console.error('Error fetching average:', error);
    }
  };

  fetchData();


  return (
    <div>
      {average !== null ? (
        <p>Durchschnitt: {average}</p>
      ) : (
        <p>Lade Durchschnitt...</p>
      )}
    </div>
  );
};

export default AVG;
