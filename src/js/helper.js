import "regenerator-runtime/runtime";
import { TIMEOUT_SECONDS } from "./config";

/**
 *
 * @param {Number} s  Time in seconds
 * @returns {Promise} Promise that rejects after the given time
 * @description  Set a timeout for the request
 */
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
/**
 * @async
 * @param {String} url  URL to fetch the data
 * @returns {Object}  data object from the API response
 * @throws {Error} If the request fails
 * @this {Object} model instance
 */
export const getJSON=async function(url){
    try{
        const response=await Promise.race([fetch(`${url}`), timeout(TIMEOUT_SECONDS)]);
        const recipeInf=await response.json()
        if(!response.ok) throw new Error(`${recipeInf.message} (${response.status})`)
        
        return recipeInf;
    }catch(err){
        throw err;
    }
}
/**
 * @async
 * @param {Stri} url URL to send the data
 * @param {Object} data Object to be sent
 * @returns {Object}  data object from the API response
 * @throws {Error} If the request fails
 * @this {Object} model instance
 */
export const sendJSON=async function(url,data){
  try{
      const request=await Promise.race([fetch(`${url}`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
      }), timeout(TIMEOUT_SECONDS)]);
      const recipeInf=await request.json()
      
      if(!request.ok) throw new Error(`${recipeInf.message} (${request.status})`)
      
      return recipeInf;
  }catch(err){
      throw err;
  }
}
export const deleteJSON=async function(url,data){
  try{
      const request=await Promise.race([fetch(`${url}`,{
        method:'DELETE',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(data),
      }), timeout(TIMEOUT_SECONDS)]);
      if(!request.ok) throw new Error(`No recipe is found in database (${request.status})`)
  }catch(err){
      throw err;
  }
}