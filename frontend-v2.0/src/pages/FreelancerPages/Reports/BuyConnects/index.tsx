/* eslint-disable */
import { PlusOutlined } from "@ant-design/icons";
import { Button, Divider, InputNumber, Radio, RadioChangeEvent, Select, Space } from "antd";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { userStore } from "src/Store/user.store";
import { useSubscription } from "src/libs/global-state-hook";
import { EPaymentMethod, EPaymentPurpose } from "src/utils/enum";
import { currencyFormatter } from "src/utils/helperFuncs";
import CustomButtonwithoutbackground from "../../../../Components/FreelancerComponents/CustomButtonwithoutbackground";
import { PayPalButton } from "react-paypal-button-v2";
import { buySickPoints } from "src/api/payment-api";
import { BlueColorButton } from "src/Components/CommonComponents/custom-style-elements/button";
import toast from "react-hot-toast";


export default function BuyConnects() {
  const { t } = useTranslation(['main'])
  const { state, setState } = useSubscription(userStore)

  const amountRef = useRef(null);

  const [paymentType, setPaymentType] = useState(EPaymentMethod.PAYPAL)

  const [buy, setBuy] = useState(0)
  const [items, setItems] = useState([3, 5, 10, 20, 40, 60]);
  const [newOptions, setOptions] = useState(0);
  const inputRef = useRef<any>(null);

  const onOptionChange = (v) => {
    setOptions(Number(v));
  };

  const handleChangeBuy = (v) => {
    setBuy(v);
  }

  const handleBuySick = () => {
    return buySickPoints({
      from: state?._id || state?.id,
      isToAdmin: true,
      purpose: EPaymentPurpose.BUYSICK,
      amount: buy * 5000,
      paymentMethod: paymentType,
      note: `User {${state.name}} ${t("Buy SickPoints Payment", { amount: buy })}`
    }, buy, (state?._id || state?.id))
  }

  const handleBuyViaBalance = () => {
    const amount = buy * 5000
    if (amount > (state?.balance || 0)) {
      return toast.error(`${t("You Don't Have Enough")} ${t("Balance")}`)
    }
    handleBuySick().then((res) => {
      console.log('after buy', res.data)
      toast.success(`${t("Successfully")} ${t("Buy SickPoints Payment", 
      { amount: buy })} ${t("Pay a fixed price")} ${currencyFormatter(amount)}
      ${t("Pay by your JobSickers Balance, your balance:")} {${currencyFormatter(state?.balance)}`)
      setState({ ...state, sickPoints: state?.sickPoints + res.data?.sickPoints, balance: state?.balance - amount })
    }).catch((err) => {
      return toast.error(`${t("Buy SickPoints Payment", { amount: buy })} ${t("Fail")}`)

    })
  }

  const handleBuyViaPaypal = () => {
    const amount = buy * 5000
    handleBuySick().then((res) => {
      console.log('after buy', res.data)
      toast.success(`${t("Successfully")} ${t("Buy SickPoints Payment", 
      { amount: buy })} ${t("Pay a fixed price")} ${currencyFormatter(amount)}
      ${t("Pay via PayPal(recommened)")}`)
      setState({ ...state, sickPoints: state?.sickPoints + res.data?.sickPoints })
    }).catch((err) => {
      return toast.error(`${t("Buy SickPoints Payment", { amount: buy })} ${t("Fail")}`)
    })
  }

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: t("Buy SickPoints Payment", { amount: buy }),
          amount: {
            currency_code: 'USD',
            value: ((buy || 1) * 5000 / 24000).toFixed(2).toString(),
          },
        },
      ],
    });
  }

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, newOptions || items[5] + 1]);
    setOptions(0);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  return (
    <>
      <section>
        <div className="W-100%">
          <br />
        </div>
        <div className="W-100%">
          <br />
        </div>
        <div className="W-100%">
          <br />
        </div>
        <div className="container card">
          <div className="row">
            <h2 id="heading" className="mb-4 pt-3 ps-5 fs-1 fw-bold ">
              {t("Buy SickPoints")}
            </h2>
            <hr />
          </div>
          <div className="row">
            <h4 className="mb-0 pt-3 ps-5 para fs-3 ">
              {t("AvalableSicks")}
            </h4>
            <div className="mb-0 pt-3 ps-5 pb-4" style={{ color: "#6058c4" }}>
              {state?.sickPoints}
            </div>
          </div>
          <div className="row">
            <h4 className="mb-0 pt-3 ps-5 fs-3 ">{t("Select the amount to buy")}</h4>
          </div>
          <div className="row">
            <div className="col-lg-5 col-md-6 col-sm-12 mb-5 mt-2 ms-md-5">
              <Select
                ref={amountRef}
                style={{ width: 269 }}
                placeholder="Select SickPoints Pack"
                onChange={(v) => handleChangeBuy(v)}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                      <InputNumber
                        ref={inputRef}
                        addonAfter={<> SickPoints</>}
                        defaultValue={1}
                        value={newOptions}
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                        onKeyDown={(e) => e.stopPropagation()}

                        onChange={(v: any) => onOptionChange(v)}
                        min={0}
                        controls
                      />
                      <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                        {t("Add")}
                      </Button>
                    </Space>
                  </>
                )}
                options={items.map((item) => ({ label: `${item} SickPoints ~ ${currencyFormatter(item * 5000)}`, value: item }))}
              />
            </div>
            <div className="row">
              <h4 className="mb-0 pt-3 ps-5 para">
                {t("Your account will be charged")}
              </h4>
              <div className="mb-0 pt-1 ps-5 pb-4" style={{ fontSize: 18, fontWeight: 600 }}>{currencyFormatter(buy * 5000)}</div>
            </div>
            <div className="row">
              <h4 className="mb-0 pt-3 ps-5 para fs-3 ">
                {t("Your new SickPoints balance will be")}
              </h4>
              <div className="mb-0 pt-1 ps-5 pb-4" style={{ fontSize: 18, fontWeight: 600 }}>{state?.sickPoints + buy} SickPoints</div>
            </div>
            <div className="row">
              <h4 className="mb-0 pt-3 ps-5 para fs-3 ">
                {t("These Sickpoints will expire on")}
              </h4>
              <div className="mb-0 pt-1 ps-5 pb-4" style={{ fontSize: 16, fontWeight: 600 }}>03/17/2026</div>
            </div>
            <h4 className="mt-30 mb-2 ps-5 para fs-3">
              <label htmlFor="promoCodeInput" className="up-label mb-0">
                Promo code
              </label>
            </h4>
            <form>
              <div className="row ps-5 mb-2">
                <div className="col-sm-7 col-md-5 col-lg-5 col-xl-5 mt-10">
                  <input
                    id="promoCodeInput"
                    type="text"
                    placeholder="Enter code"
                    maxLength={30}
                    autoComplete="off"
                    aria-describedby="promoInputError"
                    aria-required="true"
                    className="up-input form-control promo-code"
                  />
                </div>
                <div className="col-sm-5 col-md-7 col-lg-7 col-xl-7 mt-10">
                  <CustomButtonwithoutbackground headers=" Apply" />
                </div>
              </div>
              <div>
                {/**/}
                {/**/}
              </div>
            </form>
            <div className="mt-3 pt-10 ps-5 mb-3 text-muted">
              <span className="d-none-mobile-app">
                This bundle of Connects will expire 1 year from today.
              </span>
              Unused Connects rollover to the next month (maximum of 200).
              <a
                aria-label="Learn more about Connects"
                href="https://support.upwork.com/entries/61069964"
                rel="noopener noreferrer"
                target="_blank"
                className="d-none-mobile-app"
                style={{ color: "#6058c4", textDecoration: "none" }}
              >
                Learn more
              </a>
            </div>
            <div className="mt-20 ps-5 mb-3 text-muted d-none-mobile-app">
              You're authorizing JobSickers to charge your account. If you have
              sufficient funds, we will withdraw from your account balance. If
              not, the full amount will be charged to your primary billing
              method.
              <a
                aria-label="Learn more about billing methods"
                href="https://support.upwork.com/entries/61070164"
                rel="noopener noreferrer"
                target="_blank"
                style={{ color: "#6058c4", textDecoration: "none" }}
              >
                Learn more
              </a>
            </div>
            <div className="mb-5 mt-4 py-4 position-relative">
              <div style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                height: '100%',
                width: '98%',
                background: "rgba(89, 47, 214, .4)",
                zIndex: 1000,
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                display: buy ? 'none' : 'flex'
              }}>
                <h2 style={{
                  fontWeight: 800,
                  marginBottom: 28,
                }}>
                  {t("Select the amount to buy")}
                </h2>
              </div>
              <div className="row ms-md-4" style={{ opacity: !!buy ? 1 : 0.4 }}>
                <h2>{t("Payment method")}</h2>
                <div className="col-md-9 col-12 col-sm-8 mb-4">
                  <Radio.Group onChange={(e: RadioChangeEvent) => {
                    console.log('radio checked', e.target.value);
                    setPaymentType(e.target.value);
                  }} value={paymentType}>
                    <Space direction="vertical" >
                      <Radio style={{ fontSize: 18 }} value={EPaymentMethod.PAYPAL}>{t("Pay via PayPal(recommened)")}</Radio>
                      <Radio style={{ fontSize: 18 }} value={EPaymentMethod.BALANCE}>{t("Pay by your JobSickers Balance, your balance:")}{` (${currencyFormatter(state?.balance)})`}</Radio>
                      <Radio style={{ fontSize: 18 }} value={3} disabled>{t("Pay via VNPay(maintain😓)")}</Radio>
                    </Space>
                  </Radio.Group>
                </div>
                <div className="col-md-3 col-sm-4  d-flex justify-content-center mb-2">
                  {
                    paymentType === EPaymentMethod.BALANCE ?
                      <BlueColorButton onClick={handleBuyViaBalance}>{t("Buy SickPoints")}</BlueColorButton >
                      : <PayPalButton
                        style={{ color: 'silver' }}
                        createOrder={createOrder}
                        onSuccess={(details, data) => {
                          handleBuyViaPaypal()
                        }}
                      ></PayPalButton>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}
