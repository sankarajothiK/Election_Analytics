document.addEventListener('DOMContentLoaded', () => {

    const locationData = {
        "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry", "Kakinada", "Eluru", "Ongole"],
        "Arunachal Pradesh": ["Itanagar", "Tawang", "Pasighat", "Ziro", "Roing"],
        "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tezpur", "Tinsukia"],
        "Bihar": ["Patna Sahib", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Arrah", "Begusarai", "Katihar"],
        "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Rajnandgaon", "Raigarh", "Durg", "Jagdalpur"],
        "Delhi": ["New Delhi", "Chandni Chowk", "South Delhi", "East Delhi", "West Delhi", "North East Delhi", "North West Delhi"],
        "Goa": ["North Goa", "South Goa", "Panaji", "Margao", "Vasco da Gama"],
        "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar", "Anand"],
        "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Rohtak", "Hisar", "Karnal", "Sonipat", "Panchkula"],
        "Himachal Pradesh": ["Shimla", "Mandi", "Dharamshala", "Solan", "Kullu"],
        "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh"],
        "Karnataka": ["Bengaluru Central", "Bengaluru South", "Bengaluru North", "Mysuru", "Hubballi-Dharwad", "Mangaluru", "Belagavi", "Davangere", "Ballari", "Kalaburagi"],
        "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Kannur", "Alappuzha", "Kottayam", "Palakkad"],
        "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa", "Satna", "Ratlam"],
        "Maharashtra": ["Mumbai South", "Mumbai North", "Pune", "Nagpur", "Thane", "Nashik", "Kalyan", "Aurangabad", "Solapur", "Amravati", "Kolhapur"],
        "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak"],
        "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Pathankot"],
        "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bhilwara", "Alwar", "Bharatpur"],
        "Tamil Nadu": ["Gummidipoondi", "Ponneri", "Tiruttani", "Thiruvallur", "Poonamallee", "Avadi", "Maduravoyal", "Ambattur", "Madavaram", "Thiruvottiyur", "Dr. Radhakrishnan Nagar", "Perambur", "Kolathur", "Villivakkam", "Thiru-Vi-Ka-Nagar", "Egmore", "Royapuram", "Harbour", "Chepauk-Thiruvallikeni", "Thousand Lights", "Anna Nagar", "Virugampakkam", "Saidapet", "Thiyagarayanagar", "Mylapore", "Velachery", "Sholinganallur", "Alandur", "Sriperumbudur", "Pallavaram", "Tambaram", "Chengalpattu", "Thiruporur", "Cheyyur", "Madurantakam", "Uthiramerur", "Kancheepuram", "Arakkonam", "Sholingur", "Katpadi", "Ranipet", "Arcot", "Vellore", "Anaikattu", "Kilvaithinankuppam", "Gudiyatham", "Vaniyambadi", "Ambur", "Jolarpet", "Tiruppattur", "Uthangarai", "Bargur", "Krishnagiri", "Veppanahalli", "Hosur", "Thalli", "Palacode", "Pennagaram", "Dharmapuri", "Pappireddippatti", "Harur", "Chengam", "Tiruvannamalai", "Kilpennathur", "Kalasapakkam", "Polur", "Arani", "Cheyyar", "Vandavasi", "Gingee", "Mailam", "Tindivanam", "Vanur", "Villupuram", "Vikravandi", "Tirukkoyilur", "Ulundurpettai", "Rishivandiyam", "Sankarapuram", "Kallakurichi", "Gangavalli", "Attur", "Yercaud", "Omalur", "Mettur", "Edappadi", "Sankari", "Salem (West)", "Salem (North)", "Salem (South)", "Veerapandi", "Rasipuram", "Senthamangalam", "Namakkal", "Paramathi Velur", "Tiruchengodu", "Kumarapalayam", "Erode (East)", "Erode (West)", "Modakkurichi", "Dharapuram", "Kangayam", "Perundurai", "Bhavani", "Anthiyur", "Gobichettipalayam", "Bhavanisagar", "Udhagamandalam", "Gudalur", "Coonoor", "Mettupalayam", "Avanashi", "Tiruppur (North)", "Tiruppur (South)", "Palladam", "Sulur", "Kavundampalayam", "Coimbatore (North)", "Thondamuthur", "Coimbatore (South)", "Singanallur", "Kinathukadavu", "Pollachi", "Valparai", "Udumalaipettai", "Madathukulam", "Palani", "Oddanchatram", "Athoor", "Nilakottai", "Natham", "Dindigul", "Vedasandur", "Aravakurichi", "Karur", "Krishnarayapuram", "Kulithalai", "Manapaarai", "Srirangam", "Tiruchirappalli (West)", "Tiruchirappalli (East)", "Thiruverumbur", "Lalgudi", "Manachanallur", "Musiri", "Thuraiyur", "Perambalur", "Kunnam", "Ariyalur", "Jayankondam", "Tittakudi", "Virudhachalam", "Neyveli", "Panruti", "Cuddalore", "Kurinjipadi", "Bhuvanagiri", "Chidambaram", "Kattumannarkoil", "Sirkazhi", "Mayiladuturai", "Poompuhar", "Nagapattinam", "Kilvelur", "Vedaranyam", "Thiruthuraipoondi", "Mannargudi", "Thiruvarur", "Nannilam", "Thiruvidaimarudur", "Kumbakonam", "Papanasam", "Thiruvaiyaru", "Thanjavur", "Orathanadu", "Pattukkottai", "Peravurani", "Gandarvakottai", "Viralimalai", "Pudukkottai", "Thirumayam", "Alangudi", "Aranthangi", "Karaikudi", "Tiruppattur", "Sivaganga", "Manamadurai", "Melur", "Madurai East", "Sholavandan", "Madurai North", "Madurai South", "Madurai Central", "Madurai West", "Thiruparankundram", "Thirumangalam", "Usilampatti", "Andipatti", "Periyakulam", "Bodinayakanur", "Cumbum", "Rajapalayam", "Srivilliputhur", "Sattur", "Sivakasi", "Virudhunagar", "Aruppukkottai", "Tiruchuli", "Paramakudi", "Tiruvadanai", "Ramanathapuram", "Mudhukulathur", "Vilathikulam", "Thoothukkudi", "Tiruchendur", "Srivaikuntam", "Ottapidaram", "Kovilpatti", "Sankarankovil", "Vasudevanallur", "Kadayanallur", "Tenkasi", "Alangulam", "Tirunelveli", "Ambasamudram", "Palayamkottai", "Nanguneri", "Radhapuram", "Kanniyakumari", "Nagercoil", "Colachal", "Padmanabhapuram", "Vilavancode", "Killiyoor"],
        "Telangana": ["Hyderabad", "Secunderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Mahbubnagar", "Nalgonda"],
        "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Ghaziabad", "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur"],
        "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh"],
        "West Bengal": ["Kolkata South", "Kolkata North", "Howrah", "Darjeeling", "Siliguri", "Asansol", "Durgapur", "Bardhaman", "Malda", "Kharagpur"]
    };

    // Helper to populate state dropdowns
    function populateStates(stateSelectId, defaultVal) {
        const stateSelect = document.getElementById(stateSelectId);
        if (!stateSelect) return;
        
        // Don't overwrite if it already has options from Jinja, just bind the change event.
        // We will inject options dynamically if it's empty.
        if (stateSelect.options.length <= 1) {
            Object.keys(locationData).sort().forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                if (defaultVal === state) option.selected = true;
                stateSelect.appendChild(option);
            });
        }
    }

    // Helper to populate constituencies based on state
    function populateConstituencies(stateSelectId, constituencySelectId, defaultVal) {
        const stateSelect = document.getElementById(stateSelectId);
        const constituencySelect = document.getElementById(constituencySelectId);
        
        if (!stateSelect || !constituencySelect) return;

        function updateConstituencies() {
            const selectedState = stateSelect.value;
            // Clear existing
            constituencySelect.innerHTML = '<option value="" selected disabled>Choose constituency...</option><option value="all">All Constituencies</option>';
            
            if (locationData[selectedState]) {
                locationData[selectedState].sort().forEach(constituency => {
                    const option = document.createElement('option');
                    option.value = constituency;
                    option.textContent = constituency;
                    if (defaultVal === constituency) option.selected = true;
                    constituencySelect.appendChild(option);
                });
                
                // For "Other" custom fallback
                const optionOther = document.createElement('option');
                optionOther.value = 'Other';
                optionOther.textContent = 'Other (Type Below)';
                constituencySelect.appendChild(optionOther);
            }
        }

        stateSelect.addEventListener('change', updateConstituencies);
        
        // Initial population
        if (stateSelect.value && stateSelect.value !== 'all' && stateSelect.value !== '') {
            updateConstituencies();
        }
    }

    // Apply to Feedback Form
    populateStates('state', null);
    populateConstituencies('state', 'constituency_select', null);
    
    // Handle "Other" custom text input in Feedback
    const constituencySelectFeedback = document.getElementById('constituency_select');
    const constituencyOtherGroup = document.getElementById('constituency-other-group');
    const constituencyOtherInput = document.getElementById('constituency_other');
    
    if (constituencySelectFeedback) {
        constituencySelectFeedback.addEventListener('change', function() {
            if (this.value === 'Other') {
                constituencyOtherGroup.style.display = 'block';
                constituencyOtherInput.setAttribute('required', 'required');
            } else {
                constituencyOtherGroup.style.display = 'none';
                constituencyOtherInput.removeAttribute('required');
            }
        });
    }

    // Apply to Analytics Form
    const analyticsStateVal = document.getElementById('state_analytics') ? document.getElementById('state_analytics').getAttribute('data-value') : null;
    const analyticsConstVal = document.getElementById('constituency_analytics') ? document.getElementById('constituency_analytics').getAttribute('data-value') : null;
    
    populateStates('state_analytics', analyticsStateVal);
    populateConstituencies('state_analytics', 'constituency_analytics', analyticsConstVal);

    // Apply to Home Page Filters
    const homeStateVal = document.getElementById('state_home') ? document.getElementById('state_home').getAttribute('data-value') : null;
    const homeConstVal = document.getElementById('constituency_home') ? document.getElementById('constituency_home').getAttribute('data-value') : null;

    populateStates('state_home', homeStateVal);
    populateConstituencies('state_home', 'constituency_home', homeConstVal);

    // --- Multi-Step Form Logic ---
    let currentStep = 1;
    const formSteps = document.querySelectorAll('.form-step');
    const btnNext = document.querySelectorAll('.btn-next');
    const btnPrev = document.querySelectorAll('.btn-prev');
    const indicators = document.querySelectorAll('.step-indicator .step');

    function showStep(stepIndex) {
        formSteps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex - 1);
        });

        indicators.forEach((indicator, index) => {
            if (index < stepIndex - 1) {
                indicator.classList.remove('active');
                indicator.classList.add('completed');
            } else if (index === stepIndex - 1) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });
    }

    function validateStep(stepIndex) {
        const currentStepElement = document.getElementById(`step-${stepIndex}`);
        const inputs = currentStepElement.querySelectorAll('input[required], select[required]');
        
        // Special case for radio buttons (Step 3: Issue Ratings)
        if (stepIndex === 3) {
            const groupsName = ['education_rating', 'healthcare_rating', 'employment_rating', 'crime_rating', 'development_rating', 'infrastructure_rating', 'water_rating'];
            for(let name of groupsName) {
                const checked = document.querySelector(`input[name="${name}"]:checked`);
                if(!checked) {
                    currentStepElement.classList.add('was-validated');
                    alert("Please rate all issues before continuing.");
                    return false;
                }
            }
            return true;
        }

        let isValid = true;
        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return isValid;
    }

    btnNext.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < formSteps.length) {
                    currentStep++;
                    showStep(currentStep);
                }
            }
        });
    });

    btnPrev.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // --- Preferred Leader Selection Logic (Step 4) ---
    const leaderCards = document.querySelectorAll('.leader-card');
    const hiddenLeaderInput = document.getElementById('preferred_leader');
    const submitBtn = document.getElementById('btn-submit');

    leaderCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selection from all
            leaderCards.forEach(c => c.classList.remove('selected'));
            // Add selection to clicked
            this.classList.add('selected');
            // Set hidden input value
            hiddenLeaderInput.value = this.getAttribute('data-leader');
            // Enable submit button
            submitBtn.removeAttribute('disabled');
        });
    });

});
