function initializeAddressForm() {
  const addressForm = document.getElementById("address-form");
  const districtSelect = document.getElementById("district");
  const areaSelect = document.getElementById("area");
  const localAddressSelect = document.getElementById("local-address");

  if (!addressForm) {
    console.warn("Address form not found on this page.");
    return;
  }

  let locations = {};

  async function fetchLocations() {
    try {
      const response = await fetch("/data/bd-locations.json");
      if (!response.ok) {
        throw new Error("Network response was not ok for locations JSON.");
      }
      locations = await response.json();
      populateDistricts();
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  }

  function populateDistricts() {
    districtSelect.innerHTML =
      '<option value="" selected>Select District</option>';
    locations.districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district.id;
      option.textContent = district.name;
      districtSelect.appendChild(option);
    });
  }

  function populateAreas(districtId) {
    const areasForDistrict = locations.areas.filter(
      (area) => area.district_id === districtId
    );

    areaSelect.innerHTML = '<option value="" selected>Select Area</option>';
    areaSelect.disabled = true;

    if (areasForDistrict.length > 0) {
      areasForDistrict.forEach((area) => {
        const option = document.createElement("option");
        option.value = area.id;
        option.textContent = area.name;
        areaSelect.appendChild(option);
      });
      areaSelect.disabled = false;
    }
  }

  function populateLocalAddresses(areaId) {
    const localAddressesForArea = locations.local_addresses.filter(
      (local) => local.area_id === areaId
    );

    localAddressSelect.innerHTML =
      '<option value="" selected>Select Local Address</option>';
    localAddressSelect.disabled = true;

    if (localAddressesForArea.length > 0) {
      localAddressesForArea.forEach((local) => {
        const option = document.createElement("option");
        option.value = local.id;
        option.textContent = local.name;
        localAddressSelect.appendChild(option);
      });
      localAddressSelect.disabled = false;
    }
  }

  // --- Event Listeners ---
  districtSelect.addEventListener("change", () => {
    const selectedDistrictId = districtSelect.value;
    localAddressSelect.innerHTML =
      '<option value="" selected>Select Local Address</option>';
    localAddressSelect.disabled = true;

    if (selectedDistrictId) {
      populateAreas(selectedDistrictId);
    } else {
      areaSelect.innerHTML = '<option value="" selected>Select Area</option>';
      areaSelect.disabled = true;
    }
  });

  areaSelect.addEventListener("change", () => {
    const selectedAreaId = areaSelect.value;
    if (selectedAreaId) {
      populateLocalAddresses(selectedAreaId);
    } else {
      localAddressSelect.innerHTML =
        '<option value="" selected>Select Local Address</option>';
      localAddressSelect.disabled = true;
    }
  });

  addressForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(addressForm);
    const addressData = Object.fromEntries(formData.entries());
    console.log("Address Saved:", addressData);
    alert("Address saved successfully!");
  });

  // Start the process
  fetchLocations();
}
