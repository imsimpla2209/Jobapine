import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Rate, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSkills } from 'src/api/job-apis';
import { SkillBody } from 'src/types/freelancer';
import { pickName } from 'src/utils/helperFuncs';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const desc = ['terrible', 'bad', 'normal', 'good', 'Goat'];

const SkillPicker = ({ handleChange }: any) => {
  const [rates, setRates] = useState<SkillBody[]>([]);
  const [skills, setSkills] = useState<any[]>([])
  
  const { i18n } = useTranslation(['main'])

  useEffect(() => {
    getSkills().then(res => {
      setSkills(res.data.map((skill: any) => {
        return {
          label: pickName(skill, i18n.language),
          value: skill._id,
        }
      }));
    })
  }, [])

  useEffect(() => {
    handleChange(rates)
  }, [rates])

  return (
    <Form.Item
      name="dynamic_form_item"
      style={{ maxWidth: '100%', width: '100%' }}
    >
      <Form.List
        name="names"
        rules={[
          {
            validator: async (_, names) => {
              if (!names || names.length < 1) {
                return Promise.reject(new Error('At least 1 skill'));
              }
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                {...(formItemLayout)}
                required={false}
                key={field.key}
                style={{
                  marginBottom: 12

                }}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input skill or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Select
                    showSearch
                    style={{ width: 200, marginRight: 20 }}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    onChange={(v) => {
                      const rate = rates
                      rates[index].skill = v
                      setRates(rate)
                    }}
                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                    }

                    options={skills}
                  />
                </Form.Item>
                <Rate tooltips={desc} onChange={(s) => {
                  const rate = rates
                  rates[index].level = s
                  setRates(rate)
                }} value={rates[index].level} style={{ marginRight: 20 }} />
                {fields.length > 1 ? (
                  <MinusCircleOutlined
                    style={{ fontSize: 20, color: "gray" }}
                    className="dynamic-delete-button"
                    onClick={() => {
                      const rate = rates
                      rate.splice(index, 1)
                      setRates(rate)
                      remove(field.name)
                    }}
                  />
                ) : null}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => {
                  add();
                  setRates([...rates, { skill: '', level: 0 }])
                }}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >
                Add Skill
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form.Item>
  );
};

export default SkillPicker;