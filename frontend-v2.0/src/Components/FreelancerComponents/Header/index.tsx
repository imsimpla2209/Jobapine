/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import Logo from "./../../SharedComponents/Logo/Logo";
import HeaderSearchLg from "../../SharedComponents/HeaderSearchLg";
import NavLargScreen from './../NavLargScreen';
import NavSmallScreen from './../NavSmallScreen';
import HeaderSearchSm from './../../SharedComponents/HeaderSearchSm/HeaderSearchSm';
import "./Header.css";
import SearchBox from "src/Components/SharedComponents/SearchBox";
import { useTranslation } from "react-i18next";

export default function Header() {
	const { t } = useTranslation(['main'])

	const [showSearch, setShowSearch] = useState(false);
	const [showSearchIcon, setShowSearchIcon] = useState(true);

	useEffect(() => {
		console.log('first')
	}, [showSearch, showSearchIcon])

	const toggleSearchForm = () => {
		showSearch ? setShowSearch(false) : setShowSearch(true);
	}
	const hideSearchIcon = () => {
		showSearchIcon ? setShowSearchIcon(false) : setShowSearchIcon(true)
	}

	return (
		<>
			<header className="nav-bg-cn py-1">

				{/* Header in large screen */}
				<div id="nav-lg-id" className="ms-5 me-3 d-flex justify-content-between align-items-center">
					<div className="d-flex justify-content-between">
						<Logo />
						<SearchBox />
					</div>
					<nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-0">
						<NavLargScreen />
					</nav>
				</div>


				{/* Header in Small screen */}
				<div id="nav-sm-id" className="container d-flex justify-content-between align-items-center">
					{
						showSearch ?
							<div className="w-100"><HeaderSearchSm bg={showSearch} /></div>
							:
							<>
								<nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-0">
									<button className="navbar-toggler" type="button" data-bs-toggle="collapse"
										data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false"
										aria-label="Toggle navigation" onClick={hideSearchIcon}>
										{showSearchIcon ? <span className="navbar-toggler-icon"></span> : <span><i className="fas fa-times text-white"></i></span>}
									</button>
								</nav>
								<Logo />
							</>
					}
					<button id="search-btn-res-id" className="btn d-lg-none shadow-none" onClick={toggleSearchForm}>
						{showSearchIcon &&
							(showSearch
								? <i className="fas fa-times text-white"></i>
								: <i className="fa fa-search text-white"></i>)
						}
					</button>
				</div>
				<div className="container">
					<NavSmallScreen />
				</div>
				<div className="second-nav-cn pt-2 pb-1">
					<ul className="d-flex align-items-center container">
						<li><a href="#" className="fs-7">{t("Development & IT")}</a></li>
						<li><a href="#" className="fs-7">{t("Design & Creative")}</a></li>
						<li><a href="#" className="fs-7">{t("Sales & Marketing")}</a></li>
						<li><a href="#" className="fs-7">{t("Writing & Translation")}</a></li>
						<li><a href="#" className="fs-7">{t("Admin & Customer Support")}</a></li>
						<li><a href="#" className="fs-7">{t("Finance & Accounting")}</a></li>
					</ul>
				</div>
			</header>
		</>
	);
}
