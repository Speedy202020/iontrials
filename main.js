// api url
const apiUsers = "https://danny.trials.iondev.lu/users";
const apiPosts = "https://danny.trials.iondev.lu/posts";

getMyData();

// Defining async function
async function getData(url) {

    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    let data = await response.json();

    return data;  
}

async function sendMyData(myData) {
    fetch(apiPosts, {
        method: 'POST',
        body: myData,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then((response) => {
        return response.json()
    }).then((res) => {
        if (res.status === 201) {
            alert("Post successfully created!");
        }
    }).catch((error) => {
        console.log(error);
    })
}

function getMyData() {
    getData(apiUsers)
    .then(function(userData){
        getData(apiPosts)
        .then(function(postData){

            let tab;

                    // Add table headers
                    tab = ` <thead>
                    <tr>
                        <th>N° Post</th>
                        <th>Username</th>
                        <th>Post title</th>
                        <th>Post body</th>
                        <th>Delete Post</th>
                    </tr>
                </thead>
                <tbody>`;

            for (let i = 0; i < userData.length; i++) {
                for (let y = 0; y < postData.length; y++) {
                    if (userData[i].id == postData[y].userId) {
                        tab += `<tr>
                                    <td>${postData[y].id}</td>
                                    <td>${userData[i].username}</td>
                                    <td>${postData[y].title}</td>
                                    <td>${postData[y].body}</td>
                                    <td><button class="deleteButton" onclick="deletePost()" value="${postData[y].id}">Delete Post</button></td>
                                </tr>`;
                    }                   
                }
            }
            tab += `</tbody>`;
        
            // Setting innerHTML as tab variable
            document.getElementById("myTable").innerHTML = tab;
        })
    });

}

async function deletePost(){
    let postId = event.target.value;
    return fetch(apiPosts + '/' + postId, {
        method: 'delete'
      })
      .then(
        response => response.json(),
        alert("Post with id " + postId + " has been deleted!")
      );
}

const formEl = document.querySelector("#myForm");

formEl.addEventListener("submit", event => {
    event.preventDefault();

    let username = formEl.username.value;
    username = username.charAt(0).toUpperCase() + username.slice(1);
    let postTitle = formEl.postTitle.value;
    let postBody = formEl.postBody.value;
    let userId;

    getData(apiUsers).then(function(userData){
        getData(apiPosts).then(async function(postData){
            for (let i = 0; i < userData.length; i++) {
                if (userData[i].username === username) {
                    userId = userData[i].id; 
                }
            }
            if (userId === undefined) {
                alert("User doesn't exists. Please create user first.");
            }else{
                let postId = postData.length + 1;
                let data = JSON.stringify({"userId": userId, "id": postId, "title": postTitle, "body": postBody});
                sendMyData(data);
            }

        })
    })
});

function searching() {
    // Declare variables
    let input, filter, table, tr, td, i, txtValue;

    input = document.getElementById("mySearchbox");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}