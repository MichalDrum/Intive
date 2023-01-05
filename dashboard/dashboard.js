fetch("https://api.npoint.io/38edf0c5f3eb9ac768bd")
    .then(res => res.json())
    .then(res => {
        console.log(res);
    })