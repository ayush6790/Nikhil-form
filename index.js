let selection = {
  copyType: '',
  deliveryType: '',
  product: '',
  totalCost: 0
};

const prices = {
  'hard': 10,
  'soft': 5,
  'urgent-hard': 20,
  'normal-hard': 10,
  'urgent-soft': 15,
  'normal-soft': 5,
  'booklet-card-hard': 50,
  'booklet-hard': 35,
  'booklet-card-soft': 50,
  'booklet-soft': 35
};

let submissions = []; // Array to store submission data

function selectCopyType(type) {
  selection.copyType = type;
  selection.totalCost = prices[type];
  document.getElementById('step1').style.display = 'none';
  if (type === 'hard') {
    document.getElementById('step2-hard').style.display = 'block';
  } else {
    document.getElementById('step2-soft').style.display = 'block';
  }
}

function selectDeliveryType(type, copyType) {
  selection.deliveryType = type;
  selection.totalCost += prices[`${type}-${copyType}`];
  document.getElementById(`step2-${copyType}`).style.display = 'none';
  document.getElementById(`step3-${copyType}`).style.display = 'block';
}

function selectProduct(product, copyType) {
  selection.product = product;
  selection.totalCost += prices[`${product}-${copyType}`];
  document.getElementById(`step3-${copyType}`).style.display = 'none';
  updateSummary();
}

function updateSummary() {
  let summaryText = `You selected: ${selection.copyType} copy - ${selection.deliveryType} delivery - ${selection.product}.`;
  document.getElementById('summary-text').innerText = summaryText;
  document.getElementById('total-cost').innerText = `$${selection.totalCost}`;
  document.getElementById('user-details').style.display = 'block';
  document.getElementById('payment').style.display = 'block';
}

document.getElementById('user-form').addEventListener('submit', function(e) {
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
      <strong>Summary:</strong><br>
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
