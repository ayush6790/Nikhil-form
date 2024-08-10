// Define the submissions array at the top of the script
const submissions = [];

let selection = {
  copyType: '',
  deliveryType: '',
  product: '',
  validityYear: '',
  totalCost: 0,
  shippingCharge: 0,
  addOns: {}
};

const prices = {
  'hard': 10,
  'soft': 5,
  'urgent-hard': 20,
  'normal-hard': 10,
  'urgent-soft': 15,
  'normal-soft': 5,
  'booklet-card-hard': { '1': 50, '2': 90, '3': 120 },
  'booklet-hard': { '1': 35, '2': 65, '3': 90 },
  'booklet-card-soft': { '1': 50, '2': 90, '3': 120 },
  'booklet-soft': { '1': 35, '2': 65, '3': 90 },
  'card-png': 10,
  'card-pdf': 8,
  'physical-booklet-card': 20,
  'softcopy-pdf': 12,
  'professional-road-guide': 15,
  'soft-copy-card': 5,
  'additional-itca-booklet': 25,
  'itca-softcopy-pdf': 10
};

function selectCopyType(copyType) {
  selection.copyType = copyType;
  selection.totalCost += prices[copyType];

  // Add shipping charge if hard copy is selected
  if (copyType === 'hard') {
    selection.shippingCharge = 10;
  } else {
    selection.shippingCharge = 0;
  }

  document.getElementById('step1').style.display = 'none';
  document.getElementById(`step2-${copyType}`).style.display = 'block';
}

function selectDeliveryType(deliveryType, copyType) {
  selection.deliveryType = deliveryType;
  selection.totalCost += prices[`${deliveryType}-${copyType}`];

  document.getElementById(`step2-${copyType}`).style.display = 'none';
  document.getElementById(`step3-${copyType}`).style.display = 'block';
}

function updateProductSelection(copyType, product) {
  const cards = document.querySelectorAll(`#step3-${copyType} .card`);
  cards.forEach(card => {
    if (card.querySelector('select').id !== `${copyType}-${product}`) {
      card.querySelector('select').value = '';
      card.classList.remove('selected');
      const addons = card.querySelector('.addons');
      if (addons) {
        addons.style.display = 'none'; // Hide add-ons if card is not selected
      }
    }
  });

  // Reset previous selection cost and add-ons
  if (selection.product && selection.validityYear) {
    selection.totalCost -= prices[`${selection.product}-${copyType}`][selection.validityYear];
    delete selection.addOns[`${selection.product}-${copyType}`];
  }

  const selectElement = document.getElementById(`${copyType}-${product}`);
  const validityYear = selectElement.value;

  if (validityYear) {
    selectElement.closest('.card').classList.add('selected');
    selection.product = product;
    selection.validityYear = validityYear;
    selection.totalCost += prices[`${product}-${copyType}`][validityYear];

    // Show add-ons based on selected product
    const addons = document.getElementById(`${copyType}-${product}-addons`);
    if (addons) {
      addons.style.display = 'block';
    }

    // Store add-ons in selection
    selection.addOns = {};
  } else {
    selectElement.closest('.card').classList.remove('selected');
    selection.product = '';
    selection.validityYear = '';
    const addons = document.getElementById(`${copyType}-${product}-addons`);
    if (addons) {
      addons.style.display = 'none';
    }
  }
}

function updateAddOns() {
  const addOns = document.querySelectorAll(`#step3-${selection.copyType} .card.selected .addons input:checked`);
  let addOnCost = 0;
  selection.addOns = {};

  addOns.forEach(addOn => {
    const addOnValue = addOn.value;
    if (prices[addOnValue]) {
      addOnCost += prices[addOnValue];
      selection.addOns[addOnValue] = prices[addOnValue];
    }
  });

  // Add add-on cost to total cost
  selection.totalCost += addOnCost;
}

function nextStep(copyType) {
  const cards = document.querySelectorAll(`#step3-${copyType} .card select`);
  let isSelected = false;

  cards.forEach(card => {
    if (card.value) {
      isSelected = true;
    }
  });

  if (!isSelected) {
    alert('Please select a validity year for one of the products.');
    return;
  }

  updateAddOns();

  document.getElementById(`step3-${copyType}`).style.display = 'none';
  updateSummary();
}

function getBreakdown() {
  let breakdown = '';
  const copyPrice = prices[selection.copyType];
  const deliveryPrice = prices[`${selection.deliveryType}-${selection.copyType}`];
  const productPrice = prices[`${selection.product}-${selection.copyType}`][selection.validityYear];
  const shippingCharge = selection.shippingCharge;

  breakdown += `Copy Type: (${selection.copyType}): $${copyPrice}\n`;
  breakdown += `Product: ${selection.product} (${selection.validityYear} years) - $${productPrice}\n`;
  breakdown += `Delivery: ${selection.deliveryType} - $${deliveryPrice}\n`;

  Object.keys(selection.addOns).forEach(addOn => {
    breakdown += `Add-on: ${addOn.replace(/-/g, ' ')} - $${selection.addOns[addOn]}\n`;
  });

  breakdown += `Shipping Charge: $${shippingCharge}\n`;

  return breakdown;
}

function updateSummary() {
  let summaryText = `You selected: ${selection.copyType} copy - ${selection.deliveryType} delivery - ${selection.product} for ${selection.validityYear} years.`;
  document.getElementById('summary-text').innerText = summaryText;

  // Update total cost including shipping charges
  const totalCostWithShipping = selection.totalCost + selection.shippingCharge;

  document.getElementById('total-cost').innerText = `$${totalCostWithShipping}`;
  document.getElementById('user-details').style.display = 'block';
  document.getElementById('payment').style.display = 'block';

  const breakdown = getBreakdown();
  document.getElementById('breakdown').innerText = breakdown;
}

document.getElementById('user-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = {
    name: `${document.getElementById('fname').value} ${document.getElementById('lname').value}`,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    dob: document.getElementById('dob').value,
    category: document.getElementById('category').value,
    programmingLanguage: document.getElementById('category').value === 'tech' ? document.getElementById('programmingLanguage').value : null
  };

  const submission = {
    selection: { ...selection },
    formData: formData
  };

  submissions.push(submission); // Store submission data in array

  console.log(submissions); // Log the array to the console

  document.getElementById('user-details').style.display = 'none';
  const summaryText = `
      Name: ${formData.name}<br>
      Email: ${formData.email}<br>
      Phone: ${formData.phone}<br>
      Date of Birth: ${formData.dob}<br>
      Category: ${formData.category}<br>
      ${formData.category === 'tech' ? 'Programming Language: ' + formData.programmingLanguage : ''}
  `;
  document.getElementById('summary-text').innerHTML = summaryText;
  document.getElementById('summary').style.display = 'block';
});

function completePayment() {
  alert('Payment Completed!');
}
