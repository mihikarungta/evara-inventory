document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    flatpickr('.date-picker', {
        dateFormat: 'Y-m-d',
        allowInput: true
    });

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Product type options
    const productTypes = {
        diamond: ['Oval', 'Princess', 'Round', 'Emerald', 'Pear', 'Marquise', 'Heart'],
        stones: ['Red', 'Blue'],
        gold: ['14kt', '18kt']
    };

    // Update type dropdown based on product selection
    function updateTypeDropdown(productSelect, typeSelect) {
        const selectedProduct = productSelect.value;
        typeSelect.innerHTML = '<option value="">Select Type</option>';
        
        if (selectedProduct && productTypes[selectedProduct]) {
            productTypes[selectedProduct].forEach(type => {
                const option = document.createElement('option');
                option.value = type.toLowerCase();
                option.textContent = type;
                typeSelect.appendChild(option);
            });
        }
    }

    // Update weight unit based on product selection
    function updateWeightUnit(productSelect, weightUnit) {
        const selectedProduct = productSelect.value;
        if (selectedProduct === 'diamond') {
            weightUnit.textContent = 'ct';
        } else if (selectedProduct === 'stones' || selectedProduct === 'gold') {
            weightUnit.textContent = 'gm';
        } else {
            weightUnit.textContent = '';
        }
    }

    // Add event listeners for product selection changes
    document.querySelectorAll('select[id$="-product"]').forEach(select => {
        const typeSelect = select.parentElement.nextElementSibling.querySelector('select');
        const weightUnit = select.closest('form').querySelector('.weight-unit');
        
        select.addEventListener('change', () => {
            updateTypeDropdown(select, typeSelect);
            if (weightUnit) {
                updateWeightUnit(select, weightUnit);
            }
        });
    });

    // Add event listeners for item product selection changes
    document.querySelectorAll('.item-product').forEach(select => {
        const typeSelect = select.parentElement.nextElementSibling.querySelector('select');
        const weightUnit = select.closest('.item-group').querySelector('.weight-unit');
        
        select.addEventListener('change', () => {
            updateTypeDropdown(select, typeSelect);
            if (weightUnit) {
                updateWeightUnit(select, weightUnit);
            }
        });
    });

    // Payment mode validation and auto-calculation
    const cashPercentage = document.getElementById('cash-percentage');
    const onlinePercentage = document.getElementById('online-percentage');

    function updatePaymentMode(input) {
        const value = parseFloat(input.value) || 0;
        const otherInput = input === cashPercentage ? onlinePercentage : cashPercentage;
        otherInput.value = (100 - value).toFixed(2);
    }

    function validatePaymentMode() {
        const cash = parseFloat(cashPercentage.value) || 0;
        const online = parseFloat(onlinePercentage.value) || 0;
        const total = cash + online;
        
        if (total !== 100) {
            alert('Cash and Online percentages must sum to 100%');
            return false;
        }
        return true;
    }

    if (cashPercentage && onlinePercentage) {
        cashPercentage.addEventListener('input', () => updatePaymentMode(cashPercentage));
        onlinePercentage.addEventListener('input', () => updatePaymentMode(onlinePercentage));
        cashPercentage.addEventListener('change', validatePaymentMode);
        onlinePercentage.addEventListener('change', validatePaymentMode);
    }

    // Add new item group functionality
    const addItemGroupBtn = document.getElementById('add-item-group');
    const itemGroupsContainer = document.getElementById('item-groups');

    function updateGroupNumbers() {
        const groups = itemGroupsContainer.querySelectorAll('.item-group');
        groups.forEach((group, index) => {
            group.setAttribute('data-group-number', `Details ${index + 1}`);
            // Show remove button for all groups except the first one
            const removeBtn = group.querySelector('.remove-group-btn');
            removeBtn.style.display = index === 0 ? 'none' : 'flex';
        });
    }

    function removeGroup(group) {
        if (itemGroupsContainer.children.length > 1) {
            group.remove();
            updateGroupNumbers();
        }
    }

    if (addItemGroupBtn && itemGroupsContainer) {
        // Initialize first group number
        updateGroupNumbers();

        // Add click handler for remove buttons
        itemGroupsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-group-btn')) {
                removeGroup(e.target.closest('.item-group'));
            }
        });

        addItemGroupBtn.addEventListener('click', () => {
            const newGroup = itemGroupsContainer.firstElementChild.cloneNode(true);
            
            // Clear input values in the new group
            newGroup.querySelectorAll('input').forEach(input => input.value = '');
            newGroup.querySelectorAll('select').forEach(select => {
                select.selectedIndex = 0;
                if (select.classList.contains('item-type')) {
                    select.innerHTML = '<option value="">Select Type</option>';
                }
            });
            
            itemGroupsContainer.appendChild(newGroup);
            updateGroupNumbers();
        });
    }

    // Form submission handlers
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate payment mode for vendor form
            if (form.id === 'vendor-form' && !validatePaymentMode()) {
                return;
            }
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', new FormData(form));
            alert('Form submitted successfully!');
        });
    });

    // Action button handlers for status update
    const returnKarigarBtn = document.getElementById('return-karigar');
    const sellBtn = document.getElementById('sell');

    if (returnKarigarBtn) {
        returnKarigarBtn.addEventListener('click', () => {
            const form = document.getElementById('status-form');
            if (form.checkValidity()) {
                console.log('Return to Karigar:', new FormData(form));
                alert('Item returned to Karigar successfully!');
            } else {
                form.reportValidity();
            }
        });
    }

    if (sellBtn) {
        sellBtn.addEventListener('click', () => {
            const form = document.getElementById('status-form');
            if (form.checkValidity()) {
                console.log('Sell:', new FormData(form));
                alert('Item marked as sold successfully!');
            } else {
                form.reportValidity();
            }
        });
    }
}); 