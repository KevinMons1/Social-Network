{load 
    ? openCommentsPubli 
        ? <PublicationComments close={handleOpenCommentsPubli} data={dataPubliClick} /> 
        : <div className="account-content">

            {openNewPubli ? <NewPubliBox /*publi={openNewPubli}*/ setPubli={setOpenNewPubli} />  : null}
            {openModifyAccount ? <ModifyAccount slug={slug} setClose={setOpenModifyAccount} /> : null}

            <div className={themeReducer ? "account-top-dark" : "account-top"}>
                <div className="account-bg">
                    <img className="account-bg-img" src={dataUser.banner_image_url} alt="Your banner frame"/>
                </div>
                <div className="account-info">
                    <div className="account-info-top">
                        <div className={themeReducer ? "account-info-img-dark" : "account-info-img"}>
                            <img className="img-profile" src={dataUser.profile_image_url} alt="Your profile frame"/>
                        </div>
                        <div>
                            <p className={themeReducer ? "txt-dark" : null}>{dataUser.first_name} {dataUser.last_name}</p>
                        </div>

                    {parseInt(slug) !== userDataReducer.user_id
                    ? null 
                    :   <div className="account-modify">
                            <p className={themeReducer ? "txt-dark" : null} onClick={() => handleOpenModifyAccount()}>Modify my account</p>
                            <FontAwesomeIcon icon="edit" className={themeReducer ? "txt-dark" : "edit-icon"}/>
                        </div>
                    }

                    </div>
                    <div className="account-bottom">
                        <div className="account-icon">
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="heart" className="heart-icon"/>
                                <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser.likes_total}</p>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="user-friends" className="user-friends-icon"/>
                                <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser.friends_total}</p>
                            </div>
                            <div className="account-icon-box">
                                <FontAwesomeIcon icon="pen" className="pen-icon"/>
                                <p className={themeReducer ? "account-icon-nbr-dark" : "account-icon-nbr"}>{dataUser.publications_total}</p>
                            </div>
                        </div>
                        <div className="account-bio">
                            <p className={themeReducer ? "txt-dark" : null}>{dataUser.bio}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="account-publi">
                {parseInt(slug) !== userDataReducer.user_id
                ? null 
                :   <div className="new-publi">
                        <div className="write-publi" onClick={() => setOpenNewPubli(true)}>
                            <FontAwesomeIcon className={themeReducer ? "icon-new-publi txt-dark" : "icon-new-publi"} icon="comments" />
                            <div className="input-new-publi" type="text">
                                <p className={themeReducer ? "write-publi-placeholder txt-dark" : "write-publi-placeholder"}>What do you mean ?</p>
                            </div>
                        </div>
                        
                        <div className="bottom-new-publi">
                            <FontAwesomeIcon icon="image" className={themeReducer ? "icon-bottom-new-publi txt-dark" : "icon-bottom-new-publi"}  onClick={() => setOpenNewPubli(true)}/>
                            <p className={themeReducer ? "icon-bottom-new-publi txt-dark" : "icon-bottom-new-publi"}  onClick={() => setOpenNewPubli(true)}>GIF</p>
                        </div>
                    </div>
                }
            </div>

            {isEmpty 
            ?   <div className="account-empty">
                    <p className={themeReducer ? "txt-dark" : null}>This account seems very empty to me ..</p>
                </div>
            : dataPublications.map((item, index) => {
                return (
                    <div key={index} className="box-publi">
                        <PublicationCard open={handleOpenCommentsPubli} data={item} />
                    </div>
                )
            })
            }
        </div>

    : <Loader />}