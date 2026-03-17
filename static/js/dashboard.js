const footer = document.querySelector("footer");
const form = document.querySelector("form");
const input = form.querySelector(".input");
let password;
let data;

const reload = async () => {
  footer.innerHTML = `<button class="reload">Reload</button>`;
  const res = await fetch("/api/admin", {
    method: "post",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      password,
    })
  });
  if (res.status !== 200) {
    return alert("Wrong Password");
  }

  data = await res.json();
  form.style.display = "none";
  let c = 0;
  data.forEach(iv => {
    const { firstName, lastName, age, village } = iv;
    footer.innerHTML += `
      <div class="table" id="table-${c++}">
        Firstname: ${firstName} <br>
        Lastname: ${lastName} <br>
        Age: ${age} <br>
        Village: ${village} <br>
        <button class="delete">D</button>
      </div>
    `;
  })
}
form.onsubmit = async e => {
  e.preventDefault();
  password = input.value;
  reload();
}

footer.onclick = async e => {
  if (e.target.className === "delete") {
    const index = e.target.parentNode.id.slice(6);
    const deleteQuery = data[index];
    deleteQuery.password = password;
    try {
      const res = await fetch("/api/admin", {
        method: "delete",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(deleteQuery)
      });
      if (res.status === 200) {
        reload();
      }
    } catch ({ message }) {
      console.log(message);
    }
  } else if (e.target.className === "reload") {
    reload();
  }
}