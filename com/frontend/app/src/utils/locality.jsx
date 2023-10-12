/**************************************************************************
* This module houses essential functions for interacting with             *
* Locality, Province and Province data.                                *
***************************************************************************/


/**
 * Fetches a list of nationalities from the server.
 * @returns {Promise<Array>} An array containing the list of nationalities.
 */
export async function getNacionalityList() {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_Province;
        const response = await fetch(url);
        if (response.ok) {
            const ProvinceList = await response.json();
            return ProvinceList;
        } else {
            const mns = 'Failed to fetch Province List.'
            console.error(mns, " Status Code: ", response.status);
            throw new Error(mns);
        }
    } catch (error) {
        console.error('Error while try to get Nationalities: ', error);
        throw error;
    }
};


/**
 * Fetches a list of provinces associated with a specific nationality.
 * @param {string} nationalityID - The ID of the nationality for which to fetch provinces.
 * @returns {Promise<Array>} An array containing the list of provinces.
 */
export async function getProvinceList( NacionalityID ) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_NATIONALITY
            + NacionalityID;
        const response = await fetch(url);
        if (response.ok) {
            const provinceList = await response.json();
            return provinceList;
        } else {
            const mns = 'Failed to fetch Province List.'
            console.error(mns, " Status Code: ", response.status);
            throw new Error(mns);
        }
    } catch (error) {
        console.error('Error while try to get Provinces: ', error);
        throw error;
    }
};


/**
 * Fetches a list of localities associated with a specific province.
 * @param {string} provinceID - The ID of the province for which to fetch localities.
 * @returns {Promise<Array>} An array containing the list of localities.
 */
export async function getLocalityList( ProvinceID ) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_PROVINCE
            + ProvinceID;
        const response = await fetch(url);
        if (response.ok) {
            const localityList = await response.json();
            return localityList;
        } else {
            const mns = 'Failed to fetch Locality List.'
            console.error(mns, " Status Code: ", response.status);
            throw new Error(mns);
        }
    } catch (error) {
        console.error('Error while try to get Localities: ', error);
        throw error;
    }
};


/**
 * Fetches a specific locality by its ID.
 * @param {string} localityID - The ID of the locality to fetch.
 * @returns {Promise<Object|null>} The locality object if found, or null if not found.
 */
export async function getLocalityByID( localityID ) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_LOCALITY
            + localityID;
        const response = await fetch(url);
        if (response.ok) {
            const locality = await response.json();
            return locality;
        } else {
            const mns = 'Failed to fetch Locality.'
            console.error(mns, " Status Code: ", response.status);
            throw new Error(mns);
        }
    } catch (error) {
        console.error('Error while try to get Locality: ', error);
        throw error;
    }
};
