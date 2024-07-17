const formItems = [
  {
    id: "ITCA",
    name: "1-ITCA IDP Booklet",
    bodyText: "This is some body text for Item 1.",
    options: [
      { value: "10", label: "$10 for 1 year", price: 10 },
      { value: "15", label: "$15 for 2 years ", price: 15 },
    ],
    image:
      "https://img.freepik.com/free-photo/sports-car-driving-asphalt-road-night-generative-ai_188544-8052.jpg?t=st=1721233263~exp=1721236863~hmac=bebf7ea8588334a6e1889e9980c7e2a7233478ae2549d0c454679bb324a2af6f&w=1800",
  },
  {
    id: "item2",
    name: "2-Important !. Have the Soft Copy Of ITCA Victor Card (PDF)",
    bodyText: "This is some body text for Item 2.",
    options: [
      { value: "option2-1", label: "Option 2-1", price: 20 },
      { value: "option2-2", label: "Option 2-2", price: 25 },
    ],
    image:
      "https://img.freepik.com/free-photo/sports-car-driving-asphalt-road-night-generative-ai_188544-8052.jpg?t=st=1721233263~exp=1721236863~hmac=bebf7ea8588334a6e1889e9980c7e2a7233478ae2549d0c454679bb324a2af6f&w=1800",
  },
  {
    id: "item3",
    name: "Item 3",
    bodyText: "15-30 Minutes URGENT Processing ..",
    options: [
      { value: "option3-1", label: "Option 3-1", price: 30 },
      { value: "option3-2", label: "Option 3-2", price: 35 },
    ],
    image:
      "https://img.freepik.com/free-photo/sports-car-driving-asphalt-road-night-generative-ai_188544-8052.jpg?t=st=1721233263~exp=1721236863~hmac=bebf7ea8588334a6e1889e9980c7e2a7233478ae2549d0c454679bb324a2af6f&w=1800",
  },
];

function createFormItems(items) {
  const formItemsContainer = document.querySelector(".form-items-container");

  items.forEach((item) => {
    const formItem = document.createElement("div");
    formItem.classList.add("form-item");
    formItem.innerHTML = `
      <label>
        <div class="details">
          <div class="left">
            <h3>${item.name}</h3>
            <div class="left-section">
              <img src="${item.image}" alt="${item.name}" />
              <div class="left-body">
                <p class="body-text">${item.bodyText}</p>
                <select class="did-floating-select" name="${item.id}_selection">
                  <option value="" disabled selected>Select an option</option>
                  ${item.options
                    .map(
                      (option) =>
                        `<option value="${option.value}" data-price="${option.price}">${option.label}</option>`
                    )
                    .join("")}
                  </select>
                  </div>
              </div>
            </div>
            <div class="right">
              <div class="price">Cost: $<span class="option-price">0</span></div>
                </div>
        </div>
      </label>
    `;

    formItemsContainer.appendChild(formItem);

    // Add event listener to update selected option price
    const select = formItem.querySelector("select");
    const priceDisplay = formItem.querySelector(".option-price");

    select.addEventListener("change", () => {
      const selectedOption = select.options[select.selectedIndex];
      if (selectedOption && selectedOption.dataset.price) {
        priceDisplay.textContent = selectedOption.dataset.price;
      } else {
        priceDisplay.textContent = "0";
      }

      // Trigger price update across all items
      updatePrice();
    });
  });
}

function updatePrice() {
  const selectedOptions = document.querySelectorAll(".form-item select");
  let totalPrice = 0;

  selectedOptions.forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.dataset.price) {
      totalPrice += parseFloat(selectedOption.dataset.price);
    }
  });

  document.getElementById(
    "selected-price"
  ).textContent = `Total Price: $${totalPrice}`;
}

document.addEventListener("DOMContentLoaded", function () {
  createFormItems(formItems);

  const form = document.getElementById("myForm");
  const inputs = form.querySelectorAll("input, select");

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (!input.checkValidity()) {
        showError(input);
      } else {
        hideError(input);
      }
    });
  });

  function showError(input) {
    const errorDiv = input.parentElement.querySelector(".error");
    if (errorDiv) {
      errorDiv.style.display = "block";
    }
  }

  function hideError(input) {
    const errorDiv = input.parentElement.querySelector(".error");
    if (errorDiv) {
      errorDiv.style.display = "none";
    }
  }

  // Handle form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
      if (key === "resume" && value instanceof File) {
        const reader = new FileReader();
        reader.onload = function (e) {
          data[key] = e.target.result;
          console.log(data);
          alert("Form submitted successfully! Check the console for data.");
        };
        reader.readAsDataURL(value);
      } else if (!data[key]) {
        data[key] = value;
      } else {
        if (!Array.isArray(data[key])) {
          data[key] = [data[key]];
        }
        data[key].push(value);
      }
    });

    // Include dynamically created select dropdown values and handles names
    const dynamicSelects = document.querySelectorAll(".form-item select");
    dynamicSelects.forEach((select) => {
      const formItemId = select.getAttribute("name").replace("_selection", "");
      data[`${formItemId}`] = select.value;
    });

    if (!formData.get("resume")) {
      console.log(data);
      alert("Form submitted successfully! Check the console for data.");
    }
  });

  const category = document.getElementById("category");
  const techFields = document.getElementById("techFields");

  // Conditional rendering
  category.addEventListener("change", function () {
    if (this.value === "tech") {
      techFields.classList.remove("hidden");
    } else {
      techFields.classList.add("hidden");
    }
  });

  // Update price on option change
  form.addEventListener("change", updatePrice);
});
