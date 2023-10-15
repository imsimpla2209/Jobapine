import React, { useEffect, useState } from 'react';
import { Select, Space } from 'antd';

const LocationPicker = ({handleChange}: any) => {
  const [locations, setLocations] = useState([])

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/sunrise1002/hanhchinhVN/master/dist/tinh_tp.json') //eslint-disable-line
      .then((response) => response.json())
      .then((responseJson) => {
        setLocations(Object.values(responseJson).map((loc: any) => {
          return {
            label: loc.name,
            value: loc.code,
          }
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])

  return (
    <Space style={{ width: '100%' }} direction="vertical" >
      <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={[]}
        onChange={handleChange}
        options={locations}
      />
    </Space>
  )
}
export default LocationPicker;