import AsyncStorage from "@react-native-async-storage/async-storage";

export const isLocationEnable=async()=>{
    try{
        const saved=await AsyncStorage.getItem('appSettings');
        if(!saved)return false;
        const parsed=JSON.parse(saved);
        return parsed.locationServices === true;

    }catch(err){
        console.error('Failed to read location preference', err);
        return false;
    }
};