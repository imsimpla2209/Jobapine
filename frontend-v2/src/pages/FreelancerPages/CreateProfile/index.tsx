import CreateProfileAside from 'Components/FreelancerComponents/CreateProfileAside';
import CreateProfileCategory from 'Components/FreelancerComponents/CreateProfileCategory';
import CreateProfileEducationAndEmployment from 'Components/FreelancerComponents/CreateProfileEducationAndEmployment';
import CreateProfileExpertiseLevel from 'Components/FreelancerComponents/CreateProfileExpertiseLevel';
import CreateProfileGetStart from 'Components/FreelancerComponents/CreateProfileGetStart';
import CreateProfileHourlyRate from 'Components/FreelancerComponents/CreateProfileHourlyRate';
import CreateProfileLanguage from 'Components/FreelancerComponents/CreateProfileLanguage';
import CreateProfileLocation from 'Components/FreelancerComponents/CreateProfileLocation';
import CreateProfilePhoneNumber from 'Components/FreelancerComponents/CreateProfilePhoneNumber';
import CreateProfilePhoto from 'Components/FreelancerComponents/CreateProfilePhoto';
import CreateProfileSubmit from 'Components/FreelancerComponents/CreateProfileSubmit';
import CreateProfileTitleAndOverview from 'Components/FreelancerComponents/CreateProfileTitleAndOverview';
import React, { useState } from 'react'
import { Route } from 'react-router'
import { useLocation, Routes } from 'react-router-dom';

export default function CreateProfile() {

    const { pathname } = useLocation();

    const [btns, setBtns] = useState({
        category: true,
        expertiseLevel: true,
        eduAndEmp: true,
        language: true,
        hourlyRate: true,
        titleAndOverview: true,
        profilePhoto: true,
        location: true,
        PhoneNumber: true,
    })

    return (
        <section className="p-4" style={{ backgroundColor: "#F1F2F4" }}>
            <div className="container">
                <div className="row">
                    {
                        pathname !== "/create-profile/submit" &&
                        <div className="col-lg-3">
                            <CreateProfileAside btns={btns} />
                        </div>
                    }
                    <div className={pathname === "/create-profile/submit" ? "col-lg-12" : "col-lg-9"}>
                        <Routes>
                            <Route path="/create-profile" >
                                <CreateProfileGetStart setBtns={setBtns} btns={btns} />
                            </Route>
                            <Route path="/create-profile/category" >
                                <CreateProfileCategory setBtns={setBtns} btns={btns} />
                            </Route>
                            <Route path="/create-profile/expertise-level" >
                                <CreateProfileExpertiseLevel setBtns={setBtns} btns={btns} />
                            </Route>
                            <Route path="/create-profile/education-and-employment" >
                                <CreateProfileEducationAndEmployment setBtns={setBtns} btns={btns} />
                            </Route>
                            <Route path="/create-profile/language" >
                                <CreateProfileLanguage setBtns={setBtns} btns={btns} />
                            </Route>
                            <Route path="/create-profile/hourly-rate" >
                                <CreateProfileHourlyRate setBtns={setBtns} btns={btns} />
                            </Route>
                            <Route path="/create-profile/title-and-overview" >
                                <CreateProfileTitleAndOverview setBtns={setBtns} btns={btns} />
                            </Route>
                            <Route path="/create-profile/profile-photo" >
                                <CreateProfilePhoto setBtns={setBtns} btns={btns} />
                            </Route>
                            <Route path="/create-profile/location" >
                                <CreateProfileLocation setBtns={setBtns} btns={btns} />
                            </Route>
                            <Route path="/create-profile/phone-number" >
                                <CreateProfilePhoneNumber />
                            </Route>
                            <Route path="/create-profile/submit" >
                                <CreateProfileSubmit />
                            </Route>
                        </Routes>
                    </div>
                </div>
            </div>
        </section>
    )
}
