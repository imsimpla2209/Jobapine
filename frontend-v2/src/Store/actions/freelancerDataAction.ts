export const freelancersDataAction = () => async (dispatch) => {
    try {
        let res = [];
        // await db.collection("freelancer")
        //     .get().then(tal =>
        //         tal.docs.map(item => res.push(item.data()))
        //     )
        dispatch({
            type: "TALENTS_DATA",
            payload: res,
        });
    } catch (err) {
        console.log(err);
    }
};


