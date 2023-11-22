import React, { useEffect, useState } from 'react';
import { Select, Space } from 'antd';
import { getCategories } from 'src/api/job-apis';

const CategoriesPicker = ({handleChange, data, istakeValue=false, reset=false}: any) => {
  const [categories, setcategories] = useState([])
  const [selected, setSelected] = useState(data || [])

  useEffect(() => {
    if(reset) {
      setSelected([])
    }
  }, [reset])

  useEffect(() => {
    getCategories() //eslint-disable-line
      .then((response) => response)
      .then((responseJson) => {
        setcategories(responseJson.data.map((cat: any) => {
          return {
            label: cat.name,
            value: cat._id,
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
        labelInValue={istakeValue}
        value={selected}
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={[]}
        onChange={(e) => {
          setSelected(e)
          handleChange(e)
        }}
        options={categories}
      />
    </Space>
  )
}
export default CategoriesPicker;