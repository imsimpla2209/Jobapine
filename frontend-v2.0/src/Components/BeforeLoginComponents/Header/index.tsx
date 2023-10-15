/* eslint-disable */
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Logo from 'src/Components/SharedComponents/Logo/Logo';
import LanguageList from '../../SharedComponents/LanguageBtn/LanguageList';
import './Header.css';

export default function Header() {
	const { i18n } = useTranslation(['main']);
	let lang = i18n.language;
	const { t } = useTranslation(['main']);

	return (
		<header className="py-1 pt-2 fixed-top bg-white">
			<div className="container">
				<div className="d-flex justify-content-around align-items-center mb-3">
					<div className="d-flex align-items-center w-auto">
						<div className="d-flex" style={{ width: 136 }}>
							<Logo />
						</div>
						<nav className="navbar navbar-expand-lg navbar-dark bg-transparent py-0">
							<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
								<span className="navbar-toggler-icon"></span>
							</button>
							<div className="collapse navbar-collapse" id="navbarNavDropdown">
								<ul className="navbar-nav">
									<li className="nav-item dropdown">
										<a className="nav-link n-l-c-cn dropdown-toggle fs-6" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
											{t("Find Freelancer")}
											<i className="fa fa-sort-down ms-1 px-2"></i>
										</a>
										<ul id="find-freelancer-dd-id" className={`dropdown-menu pb-4 ${lang === 'vi' && "text-end"}`} aria-labelledby="navbarDropdownMenuLink">
											<ul className="mt-3 d-inline-block typeOfwork-cn" >
												<span className="fw-bold">{t("TYPE OF WORK")}</span>
												<li><Link className="dropdown-item" to="dev-it">{t("Development & IT")}</Link></li>
												<li><a className="dropdown-item" href="#">{t("Design & Creative")}</a></li>
												<li><a className="dropdown-item" href="#">{t("Sales & Marketing")}</a></li>
												<li><a className="dropdown-item" href="#">{t("Writing & Translation")}</a></li>
												<li><a className="dropdown-item" href="#">{t("Admin & Customer Support")}</a></li>
												<li><a className="dropdown-item" href="#">{t("Finance & Accounting")}</a></li>
												<li><a className="dropdown-item" href="#">{t("See all specializations")}</a></li>
											</ul>
											{
												lang !== 'vi' &&
												<div className="mt-3 ms-5 ps-4 d-inline-block waysToHire-cn">
													<span className="fw-bold">{t("WAYS TO HIRE")}</span>
													<div className="d-flex mt-3 pb-5">
														<div>
															<a href="#">
																<p className="fw-bold">{t("Freelancer Marketplace")}</p>
																<p className="">{t("Post a job and get proposals")}</p>
															</a>
															<a href="#">
																<p className="fw-bold">{t("Freelancer Scout")}</p>
																<p>{t("Have us find you an expert")}</p>
															</a>
														</div>
														<div className="ms-5">
															<a href="#">
																<p className="fw-bold">{t("Freelancer Scout")}</p>
																<p className="">{t("Have us find you an expert")}</p>
															</a>
															<a href="#">
																<p className="fw-bold">{t("Enterprise Suite")}</p>
																<p>{t("Revamp the way you hire")}</p>
															</a>
														</div>
													</div>
													<div className={`border-top mt-5 pt-4 ${lang === 'vi' && "fs-6"}`}>
														<a href="#">{t("Learn how to hire on JobSickers")}
															<i className={`fa ${lang === 'vi' ? "fa-arrow-left pe-3 " : "fa-arrow-right"} ms-3 text-success `}></i></a>

													</div>
												</div>
											}
										</ul>
									</li>
									<li className="nav-item dropdown">
										<a className="nav-link n-l-c-cn dropdown-toggle fs-6" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
											{t("FindWork")}
											<i className="fa fa-sort-down ms-1  px-2"></i>
										</a>
										<ul id="find-work-dd-id" className="dropdown-menu pb-4" aria-labelledby="navbarDropdownMenuLink">
											<div className="d-flex text-end">
												<ul className="mt-3 d-inline-block ">
													<span className="fw-bold">{t("TYPE OF WORK")}</span>
													<li><Link className="dropdown-item mt-3" to="freelance-jobs">{t("Development & IT")}</Link></li>
													<li><a className="dropdown-item" href="#">{t("Design & Creative")}</a></li>
													<li><a className="dropdown-item" href="#">{t("Sales & Marketing")}</a></li>
													<li><a className="dropdown-item" href="#">{t("Writing & Translation")}</a></li>
												</ul>
												<ul className="d-inline-block ms-5">
													<li><a className="dropdown-item mt-5 pt-4" href="#">{t("Admin & Customer Support")}</a></li>
													<li><a className="dropdown-item" href="#">{t("Finance & Accounting")}</a></li>
													<li><a className="dropdown-item" href="#">{t("See all specializations")}</a></li>
												</ul>
											</div>
											<div className="mt-3 ps-4 d-inline-block">
												<div className="border-top pt-3">
													<a href="#" className={` pt-4 ${lang === 'vi' && "fs-6"}`}>
														{t("Learn how to get hired on JobSickers")}
														<i className={`fa ${lang === 'vi' ? "fa-arrow-left pe-3 " : "fa-arrow-right"} ms-3 text-success `}></i>
													</a>
												</div>
											</div>
										</ul>
									</li>
									<li className="nav-item dropdown">
										<a className="nav-link n-l-c-cn dropdown-toggle fs-6" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
											{t("Why JobSickers")}
											<i className="fa fa-sort-down ms-1  px-2"></i>
										</a>
										<ul id="why-work-dd-id" className={`dropdown-menu mt-3 ${lang === 'vi' && "fs-6 text-end"}`} aria-labelledby="navbarDropdownMenuLink">
											<li><a className="dropdown-item py-2 mt-3" href="#">{t("Success Stories")}</a></li>
											<li><a className="dropdown-item py-2" href="#">{t("Reviews")}</a></li>
											<li><a className="dropdown-item py-2" href="#">{t("Learn")}</a></li>
											<li><a className="dropdown-item py-2" href="#">{t("Forums")}</a></li>
										</ul>
									</li>
								</ul>
							</div>
						</nav>
					</div>
					<div className="d-flex justify-content-between col-7">
						<form id="search-form-id" className="d-flex">
							<button className="btn position-relative search-btnn-cn ">
								<i className="fa fa-search search-icon-cn"></i>
							</button>
							<div className="nav-item dropdown search-type-cn ">
								<a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
									<i className="fa fa-sort-down search-icon-cn"></i>
								</a>
								<ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
									<a className="dropdown-item px-4" href="#">
										<div className="d-flex align-items-center">
											<span className="me-2 mb-3"><i className="fas fa-user fs-6"></i></span>
											<div className="acc-cn ms-2">
												<p>{t("Freelancer")}</p>
												<p>{t("Hire professionals and agencies")}</p>
											</div>
										</div>
									</a>
									<a className="dropdown-item px-4" href="#">
										<div className="d-flex align-items-center">
											<span className="me-2 mb-3"><i className="fas fa-clipboard-list fs-6"></i></span>
											<div className="acc-cn ms-2">
												<p>{t("Projects ")}<span id="search-type-projects-new" className="rounded-pill">{t("NEW")}</span>
												</p>
												<p>{t("Buy pre-defined projects")}</p>
											</div>
										</div>
									</a>
									<a className="dropdown-item px-4" href="#">
										<div className="d-flex align-items-center">
											<span className="me-2 mb-3"><i className="fas fa-briefcase fs-6"></i></span>
											<div className="acc-cn ms-2">
												<p>{t("Jobs")}</p>
												<p>{t("Apply to jobs posted by clients")}</p>
											</div>
										</div>
									</a>
								</ul>
							</div>
							<input className="form-control ms-1 ps-5 py-1 search-inputt-cn" type="search" placeholder={t("Search")} aria-label="Search" />
						</form>
						<div className="col-md-5 border-start ps-2 d-flex j justify-content-end">
							<Link className={`btn login-btn-cn ${lang === 'vi' && "fs-6"}`} to="/login">{t("Log In")}</Link>
							<Link className={`btn signup-btn-cn px-3 py-2 ${lang === 'vi' && "fs-6"}`} to="/sign-up">{t("Sign Up")}</Link>
							<LanguageList />
						</div>
					</div>
				</div>
			</div>
			<div className="second-nav-cn pt-2 pb-1">
				<div className="container">
					<ul className="d-flex align-items-center ms-0 ps-0">
						<li><a href="#" className="fs-6">{t("Development & IT")}</a></li>
						<li><a href="#" className="fs-6">{t("Design & Creative")}</a></li>
						<li><a href="#" className="fs-6">{t("Sales & Marketing")}</a></li>
						<li><a href="#" className="fs-6">{t("Writing & Translation")}</a></li>
						<li><a href="#" className="fs-6">{t("Admin & Customer Support")}</a></li>
						<li><a href="#" className="fs-6">{t("Finance & Accounting")}</a></li>
					</ul>
				</div>
			</div>
		</header>
	)
}
