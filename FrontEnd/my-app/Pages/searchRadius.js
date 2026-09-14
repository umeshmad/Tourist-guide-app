import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSearchRadius=async()=>{
    const saved=await AsyncStorage.getItem('appSettings');
    if(!saved)return 10;
    const parsed=JSON.parse(saved);
    return parsed.searchRadius ?? 10;
}