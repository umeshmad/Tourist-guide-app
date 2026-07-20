import React, { useState } from 'react';
import '../global.css';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import BASE_URL from '../config';

export default function Preferences({ route, navigation }) {
    const { registrationData = {}, isEditMode = false, email: editEmail = '' } = route.params || {};

    // Preference States
    const [travelStyle, setTravelStyle] = useState('');
    const [accommodation, setAccommodation] = useState('');
    const [environment, setEnvironment] = useState('');
    const [pace, setPace] = useState('');
    const [dietary, setDietary] = useState('');
    const [activities, setActivities] = useState([]);
    
    // Wizard Step State
    const [currentStep, setCurrentStep] = useState(1);

    // Questions Data (Emojis removed)
    const travelStyles = [
        { id: 'relaxation', label: 'Relaxation & Leisure', description: 'Beaches, resorts, wellness, and slow breaks' },
        { id: 'adventure', label: 'Adventure & Thrills', description: 'Hiking, water sports, and outdoor activities' },
        { id: 'culture', label: 'Culture & History', description: 'Temples, heritage sites, arts, and monuments' },
        { id: 'nature', label: 'Nature & Wildlife', description: 'Scenic parks, reserves, safaris, and ecotourism' },
    ];

    const accommodations = [
        { id: 'luxury', label: 'Luxury Hotels & Resorts', description: 'Premium stays with premium amenities' },
        { id: 'boutique', label: 'Boutique & Heritage Stays', description: 'Unique, local-themed charming properties' },
        { id: 'eco', label: 'Eco Lodges & Homestays', description: 'Nature-aligned, sustainable rustic stays' },
        { id: 'hostel', label: 'Hostels & Shared Guesthouses', description: 'Social, budget-friendly backpacker spots' },
    ];

    const environments = [
        { id: 'mountains', label: 'Mountains & Highlands', description: 'Chilly winds, tea plantations, and scenic peaks' },
        { id: 'coastal', label: 'Beaches & Coastal Towns', description: 'Golden sands, ocean breezes, and surf points' },
        { id: 'historic', label: 'Ancient & Historic Cities', description: 'Ruins, old fortresses, and cultural centers' },
        { id: 'forest', label: 'Rain Forests & National Parks', description: 'Lush green woods and wildlife trails' },
    ];

    const paces = [
        { id: 'slow', label: 'Slow & Relaxed', description: 'Taking time to soak in one location per day' },
        { id: 'moderate', label: 'Balanced', description: 'Moderate schedule covering key sights smoothly' },
        { id: 'fast', label: 'Fast-paced', description: 'Action-packed schedules seeing as much as possible' },
    ];

    const dietaryOptions = [
        { id: 'none', label: 'All Cuisines', description: 'No restrictions, eager to try local foods' },
        { id: 'veg', label: 'Vegetarian / Vegan', description: 'Plant-based options and clean green cafes' },
        { id: 'local', label: 'Local & Street Food', description: 'Authentic street eats, hoppers, kottu & local bites' },
        { id: 'seafood', label: 'Seafood Fanatic', description: 'Ocean fresh fish, prawns, and coastal dishes' },
    ];

    const activityList = [
        { id: 'hiking', label: 'Hiking & Trekking' },
        { id: 'beaches', label: 'Water Sports & Beaches' },
        { id: 'sightseeing', label: 'Sightseeing & Museums' },
        { id: 'foodie', label: 'Local Food & Dining' },
        { id: 'wildlife', label: 'Wildlife Safaris' },
        { id: 'nightlife', label: 'Music & Nightlife' },
    ];

    const toggleActivity = (id) => {
        if (activities.includes(id)) {
            setActivities(activities.filter(a => a !== id));
        } else {
            setActivities([...activities, id]);
        }
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1: return travelStyle !== '';
            case 2: return accommodation !== '';
            case 3: return environment !== '';
            case 4: return pace !== '';
            case 5: return dietary !== '';
            case 6: return activities.length > 0;
            default: return false;
        }
    };

    const handleNext = () => {
        if (!isStepValid()) {
            Alert.alert("Selection Required", "Please choose an option to proceed.");
            return;
        }
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinish();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFinish = async () => {
        const userEmail = isEditMode ? editEmail : registrationData.email;
        const completeProfile = {
            ...registrationData,
            preferences: {
                travelStyle,
                accommodation,
                environment,
                pace,
                dietary,
                activities
            }
        };

        try{
            const response=await fetch(`${BASE_URL}/auth/preferances`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    email: userEmail,
                    preferences: completeProfile.preferences
                })
            });
            const data=await response.json();
            if(!response.ok){
                Alert.alert("Error", data.error);
                return;
            }
            if (isEditMode) {
                Alert.alert("Success", "Preferences updated successfully!");
                navigation.goBack();
            } else {
                navigation.navigate("Home");
            }
        }catch(err){
            Alert.alert("Error", "Could not save preferences");
        }
    };

    const getStepDetails = () => {
        switch (currentStep) {
            case 1:
                return {
                    title: "What is your primary travel style?",
                    subtitle: "Select the option that best describes your trip goals.",
                    data: travelStyles,
                    selectedId: travelStyle,
                    onSelect: setTravelStyle,
                };
            case 2:
                return {
                    title: "Preferred accommodation style?",
                    subtitle: "Choose your favorite type of lodging.",
                    data: accommodations,
                    selectedId: accommodation,
                    onSelect: setAccommodation,
                };
            case 3:
                return {
                    title: "Which environment do you enjoy?",
                    subtitle: "Pick the landscape you would love to explore.",
                    data: environments,
                    selectedId: environment,
                    onSelect: setEnvironment,
                };
            case 4:
                return {
                    title: "What is your travel pace?",
                    subtitle: "Tell us how active or relaxed you want your schedule.",
                    data: paces,
                    selectedId: pace,
                    onSelect: setPace,
                };
            case 5:
                return {
                    title: "Any dietary preferences?",
                    subtitle: "Help us find matching restaurants for you.",
                    data: dietaryOptions,
                    selectedId: dietary,
                    onSelect: setDietary,
                };
            default:
                return null;
        }
    };

    const stepDetails = getStepDetails();

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'left', 'right']}>
                {/* Header Profile Setup Indicator */}
                <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-blue-600 font-bold text-xs tracking-wider uppercase">
                            Step {currentStep} of 6
                        </Text>
                        <Text className="text-gray-400 text-xs font-semibold">
                            {Math.round((currentStep / 6) * 100)}% Complete
                        </Text>
                    </View>
                    {/* Progress Bar Container */}
                    <View className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <View 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${(currentStep / 6) * 100}%` }} 
                        />
                    </View>
                </View>

                <ScrollView 
                    showsVerticalScrollIndicator={false} 
                    contentContainerStyle={{ paddingBottom: 100 }}
                    className="flex-1 px-6 pt-6"
                >
                    {/* Step Title & Subtitle */}
                    <View className="mb-6">
                        <Text className="text-2xl font-extrabold text-gray-800 tracking-tight leading-tight">
                            {currentStep === 6 ? "Select specific activities" : stepDetails?.title}
                        </Text>
                        <Text className="text-gray-400 text-[14px] mt-1.5 font-medium">
                            {currentStep === 6 ? "Choose multiple options that match your interests." : stepDetails?.subtitle}
                        </Text>
                    </View>

                    {/* Step Options */}
                    {currentStep < 6 && stepDetails && (
                        <View className="space-y-3">
                            {stepDetails.data.map((item) => {
                                const selected = stepDetails.selectedId === item.id;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => stepDetails.onSelect(item.id)}
                                        activeOpacity={0.7}
                                        className={`p-5 rounded-2xl border flex-row items-center ${
                                            selected 
                                                ? 'bg-blue-50 border-blue-500' 
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <View className="flex-1 pr-3">
                                            <Text className={`font-bold text-[16px] tracking-wide ${
                                                selected ? 'text-blue-700' : 'text-gray-800'
                                            }`}>
                                                {item.label}
                                            </Text>
                                            <Text className="text-gray-400 text-[12px] mt-1 leading-normal font-medium">
                                                {item.description}
                                            </Text>
                                        </View>
                                        <View className={`w-6 h-6 rounded-full border-2 justify-center items-center ${
                                            selected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                                        }`}>
                                            {selected && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {/* Step 6 (Activities Checklist) */}
                    {currentStep === 6 && (
                        <View className="flex-row flex-wrap justify-between">
                            {activityList.map((item) => {
                                const selected = activities.includes(item.id);
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => toggleActivity(item.id)}
                                        activeOpacity={0.7}
                                        className={`w-[48%] p-4 rounded-2xl border mb-4 items-center justify-center min-h-[90px] ${
                                            selected 
                                                ? 'bg-blue-600 border-transparent' 
                                                : 'bg-white border-gray-200'
                                        }`}
                                    >
                                        <Text className={`text-[14px] font-bold text-center ${
                                            selected ? 'text-white' : 'text-gray-800'
                                        }`}>
                                            {item.label}
                                        </Text>
                                        <View className={`w-4 h-4 rounded-md border mt-2 justify-center items-center ${
                                            selected ? 'border-white bg-white' : 'border-gray-300'
                                        }`}>
                                            {selected && <View className="w-2 h-2 bg-blue-600 rounded-sm" />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Navigation Buttons */}
                <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => currentStep > 1 ? handleBack() : navigation.goBack()}
                        activeOpacity={0.7}
                        className="bg-gray-100 border border-gray-200 rounded-2xl py-4 px-6 items-center justify-center flex-1 mr-3"
                    >
                        <Text className="text-gray-600 text-[15px] font-bold">
                            {currentStep > 1 ? "Back" : "Cancel"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleNext}
                        activeOpacity={0.7}
                        className={`rounded-2xl py-4 px-6 items-center justify-center flex-[2] ${
                            isStepValid() ? 'bg-blue-600' : 'bg-blue-200'
                        }`}
                        disabled={!isStepValid()}
                    >
                        <Text className="text-white text-[15px] font-bold">
                            {currentStep === 6 ? (isEditMode ? "Save Preferences" : "Complete Setup") : "Next Question"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
