/* eslint-disable */
import React from 'react'
import '../HomeSecondSection/HomeSecondSection.css'
import { useTranslation } from "react-i18next";
import { useSelector } from 'react-redux';


export default function HomeThirdSection() {
	const { i18n, t } = useTranslation(['main']);
	let lang = i18n.language;

	return (
		<section>
			<div className="container">
				<div className="row">
					<div className="text-center mt-4">
						<p className={`my-5 fw-bold ss-p-cn ${lang === 'vi' && "fs-5"}`}>{t("FORTALENT")}</p>
						<h2 className="ss-h2-cn">{t("Workyourway")}</h2>
						<p className={`my-5 ss-p2-cn ${lang === 'vi' && "fs-4"}`}>{t("Choosehowyouwork")}</p>
					</div>
				</div>
				<div className="row justify-content-evenly">
					<div className="col-md-4 col-sm-12">
						<div className="shadow my-4 ss-box-cn position-relative">
							<a className="d-inline-block p-5" href="#">
								<h3>{t("Findaprojecttoworkon")}</h3>
								<p className={`mb-5 pb-5 ${lang === 'vi' && "fs-4"}`}>{t("FreelancerMarketplace")}</p>
								<div className="position-absolute py-3 px-4 fs-2">
									<i className="fas fa-arrow-right"></i>
								</div>
							</a>
						</div>
					</div>
					<div className="col-md-4 col-sm-12">
						<div className="shadow my-4 ss-box-cn position-relative">
							<a className="d-inline-block p-5" href="#">
								<h3>{t("Sellaprefefinedproject")}</h3>
								<p className={`mb-5 pb-5 ${lang === 'vi' && "fs-4"}`}>{t("ProjectCatalog")}</p>
								<div className="position-absolute py-3 px-4 fs-2">
									<i className="fas fa-arrow-right"></i>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
