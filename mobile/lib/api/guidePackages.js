import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchGuidePackages = async (userId) => {
  try {
    // Try multiple endpoints to get guide packages
    const endpoints = [
      `${API_URL}guide-packages/${userId}`,
      `${API_URL}tourguide/packages/${userId}`,
      `${API_URL}tour-packages/guide/${userId}`
    ];
    
    let response = null;
    let successEndpoint = null;
    
    // Try each endpoint until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint}`);
        const result = await axios.get(endpoint, {
          withCredentials: true,
        });
        
        if (result.status === 200) {
          response = result;
          successEndpoint = endpoint;
          break;
        }
      } catch (endpointError) {
        console.log(`Endpoint ${endpoint} failed: ${endpointError.message}`);
      }
    }
    
    // If no endpoint worked, try the fallback approach
    if (!response) {
      console.log("Trying fallback approach: get guide profile first");
      
      // Try to get guide profile
      const profileEndpoints = [
        `${API_URL}tourguide/profile/${userId}`,
        `${API_URL}guideRegis/user/${userId}`,
        `${API_URL}tourguide-applicants/user/${userId}`
      ];
      
      let guideProfile = null;
      
      for (const endpoint of profileEndpoints) {
        try {
          const profileResult = await axios.get(endpoint, {
            withCredentials: true,
          });
          
          if (profileResult.status === 200) {
            guideProfile = profileResult.data;
            console.log(`Guide profile found at ${endpoint}:`, guideProfile);
            break;
          }
        } catch (profileError) {
          console.log(`Profile endpoint ${endpoint} failed: ${profileError.message}`);
        }
      }
      
      if (guideProfile) {
        const guideId = guideProfile.id || guideProfile.guide_id || guideProfile.tourguide_id;
        
        if (guideId) {
          console.log(`Found guide ID: ${guideId}, trying to get assignments`);
          
          // Try to get assignments
          const assignmentEndpoints = [
            `${API_URL}tourguide/assignments/${guideId}`,
            `${API_URL}tourguide-assignments/guide/${guideId}`,
            `${API_URL}guide-assignments/${guideId}`
          ];
          
          let assignments = null;
          
          for (const endpoint of assignmentEndpoints) {
            try {
              const assignmentResult = await axios.get(endpoint, {
                withCredentials: true,
              });
              
              if (assignmentResult.status === 200) {
                assignments = assignmentResult.data;
                console.log(`Assignments found at ${endpoint}:`, assignments);
                break;
              }
            } catch (assignmentError) {
              console.log(`Assignment endpoint ${endpoint} failed: ${assignmentError.message}`);
            }
          }
          
          if (assignments && Array.isArray(assignments) && assignments.length > 0) {
            // Get package IDs from assignments
            const packageIds = assignments
              .map(a => a.tour_package_id || a.package_id)
              .filter(id => id);
              
            if (packageIds.length > 0) {
              console.log(`Found package IDs: ${packageIds}, fetching package details`);
              
              // Get package details
              const packagesPromises = packageIds.map(id => 
                axios.get(`${API_URL}tour-packages/${id}`, {
                  withCredentials: true,
                })
              );
              
              const packagesResults = await Promise.all(
                packagesPromises.map(p => p.catch(e => ({ error: e })))
              );
              
              const packages = packagesResults
                .filter(r => !r.error)
                .map(r => r.data);
                
              if (packages.length > 0) {
                console.log(`Successfully fetched ${packages.length} packages`);
                return packages;
              }
            }
          }
        }
      }
      
      // Last resort: get all packages
      console.log("Trying last resort: get all packages");
      const allPackagesResponse = await axios.get(`${API_URL}tour-packages`, {
        withCredentials: true,
      });
      
      if (allPackagesResponse.status === 200) {
        console.log("Using all packages as fallback");
        return allPackagesResponse.data;
      }
      
      throw new Error("All approaches to get guide packages failed");
    }
    
    console.log(`Successfully fetched guide packages from ${successEndpoint}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error Fetching Guide Packages: ",
      error.response?.data || error.message
    );
    throw error;
  }
};