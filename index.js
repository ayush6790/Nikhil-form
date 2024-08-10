// Define the submissions array at the top of the script
const submissions = [];

let selection = {
  copyType: '',
  deliveryType: '',
  product: '',
  validityYear: '',
  totalCost: 0,
  shippingCharge: 0,
  addOns: {},
  urgentSoftPrice: 0
};

const prices = {
  'hard': 10,
  'soft': 5,
  'urgent-hard': 20,
  'normal-hard': 10,
  'urgent-soft-weekday': 15,
  'urgent-soft-weekend': 20,
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


function getUKTime() {
  const now = new Date();
  const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
  return ukTime;
}

function enableUrgentButtons(copyType) {
  const ukTime = getUKTime();
  const hours = ukTime.getHours();
  const day = ukTime.getDay();

  const isWeekday = day >= 1 && day <= 4;
  const isWithinBusinessHours = hours >= 9 && hours <= 19;

  const urgentHardButton = document.getElementById('urgent-hard');
  const urgentHardHelper = document.getElementById('urgent-hard-helper');
  const urgentSoftButton = document.getElementById('urgent-soft');
  const urgentSoftHelper = document.getElementById('urgent-soft-helper');

  // Hide both helper texts initially
  urgentHardHelper.style.display = 'none';
  urgentSoftHelper.style.display = 'none';

  // Reset buttons to disabled state
  urgentHardButton.disabled = true;
  urgentSoftButton.disabled = true;

  if (copyType === 'hard') {
    if (isWithinBusinessHours && isWeekday) {
      urgentHardButton.disabled = false;
    } else {
      urgentHardHelper.innerText = isWithinBusinessHours 
        ? "Urgent hard copies are only available on weekdays."
        : "Urgent hard copies are only available during business hours (9am to 5pm).";
      urgentHardHelper.style.display = 'block';
    }
  } else if (copyType === 'soft') {
    if (isWithinBusinessHours) {
      urgentSoftButton.disabled = false;
      // Set the price for urgent soft based on the day
      selection.urgentSoftPrice = isWeekday ? prices['urgent-soft-weekday'] : prices['urgent-soft-weekend'];
    } else {
      urgentSoftHelper.innerText = "Urgent soft copies are only available during business hours (9am to 5pm).";
      urgentSoftHelper.style.display = 'block';
    }
  }
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

let feeAmount = 0;


document.getElementById('shipping-country').addEventListener('change', function() {
  const shippingFees = {
      'europe': 30,
      'india': 15,
      'malaysia': 25,
      'others': 50
  };

  const countryNames = {
      'europe': 'Europe',
      'india': 'India',
      'malaysia': 'Malaysia',
      'others': 'Others'
  };

  const selectedCountry = this.value;
   feeAmount = shippingFees[selectedCountry] || 0;
  const countryName = countryNames[selectedCountry];

  // Update the fee amount
  document.getElementById('fee-amount').textContent = `$${feeAmount}`;

  // Show the selected country and amount
  const selectedInfo = document.getElementById('selected-info');
  selectedInfo.textContent = `Selected Country: ${countryName}, Shipping Fee: $${feeAmount}`;
});





function getBreakdown() {
  let breakdown = '';
  const copyPrice = prices[selection.copyType];
  let deliveryPrice;

  // Determine the correct delivery price
  if (selection.deliveryType === 'urgent' && selection.copyType === 'soft') {
    deliveryPrice = selection.urgentSoftPrice;
  } else {
    deliveryPrice = prices[`${selection.deliveryType}-${selection.copyType}`];
  }

  const productPrice = prices[`${selection.product}-${selection.copyType}`][selection.validityYear];
  const shippingCharge = feeAmount;

  breakdown += `Copy Type: (${selection.copyType}): $${copyPrice}\n`;
  breakdown += `Product: ${selection.product} (${selection.validityYear} years) - $${productPrice}\n`;
  breakdown += `Delivery: ${selection.deliveryType} - $${deliveryPrice}\n`;

  Object.keys(selection.addOns).forEach(addOn => {
    breakdown += `Add-on: ${addOn.replace(/-/g, ' ')} - $${selection.addOns[addOn]}\n`;
  });

  breakdown += `Shipping Charge: $${shippingCharge}\n`;

  return breakdown;
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
  document.getElementById('payment').style.display = 'block';
  updateStepIndicator(4);

});

function completePayment() {
  alert('Payment Completed!');
}












function updateStepIndicator(stepNumber) {
  const steps = document.querySelectorAll('.step-indicator li');
  steps.forEach((step, index) => {
    if (index < stepNumber) {
      step.classList.remove('inactive');
      step.classList.add('completed');
    } else if (index === stepNumber) {
      step.classList.remove('inactive');
      step.classList.add('active');
    } else {
      step.classList.remove('active', 'completed');
      step.classList.add('inactive');
    }
  });
}



function selectCopyType(copyType) {
  selection.copyType = copyType;
  selection.totalCost += prices[copyType];

  if (copyType === 'hard') {
    selection.shippingCharge = 10;
  } else {
    selection.shippingCharge = 0;
  }

  document.getElementById('step1').style.display = 'none';
  document.getElementById(`step2-${copyType}`).style.display = 'block';

  // Update step indicator to step 2
  updateStepIndicator(1);

  enableUrgentButtons(copyType);
}



function selectDeliveryType(deliveryType, copyType) {
  selection.deliveryType = deliveryType;

  if (deliveryType === 'urgent' && copyType === 'soft') {
    selection.totalCost += selection.urgentSoftPrice;
  } else {
    selection.totalCost += prices[`${deliveryType}-${copyType}`];
  }

  document.getElementById(`step2-${copyType}`).style.display = 'none';
  document.getElementById('urgent-hard-helper').style.display = 'none';
  document.getElementById('urgent-soft-helper').style.display = 'none';
  document.getElementById(`step3-${copyType}`).style.display = 'block';

  // Update step indicator to step 3
  updateStepIndicator(2);
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
  
  // Update step indicator to step 4
  updateStepIndicator(3);
  updateSummary();
}




function updateSummary() {
  let summaryText = `You selected: ${selection.copyType} copy - ${selection.deliveryType} delivery - ${selection.product} for ${selection.validityYear} years.`;
  document.getElementById('summary-text').innerText = summaryText;

  const totalCostWithShipping = selection.totalCost + selection.shippingCharge +feeAmount;
  document.getElementById('total-cost').innerText = `$${totalCostWithShipping}`;
  document.getElementById('user-details').style.display = 'block';

  const breakdown = getBreakdown();
  document.getElementById('breakdown').innerText = breakdown;

  // Update step indicator to step 4
  // updateStepIndicator(4);
}

