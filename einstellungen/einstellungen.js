export let jsonObj = null;

export function setEinstellungen(jsonText_){
    jsonObj = JSON.parse(jsonText_);
    console.log(jsonObj);
}

export function getEinstellungen(){
    return jsonObj;
}
