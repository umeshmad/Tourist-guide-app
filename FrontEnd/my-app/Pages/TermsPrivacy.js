import React, { useState } from 'react';
import '../global.css';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'nativewind';
import document from '../assets/google-docs.png';
import clipboardIcon from '../assets/clipboard.png';
import padlockIcon from '../assets/padlock.png';

export default function TermsPrivacy() {
    const navigation = useNavigation();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [activeTab, setActiveTab] = useState('terms');

    const SectionBlock = ({ title, children }) => (
        <View className="mb-5">
            <Text className="text-gray-900 dark:text-white text-[15px] font-bold mb-2">{title}</Text>
            <View className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4" style={{ elevation: isDark ? 0 : 1 }}>
                {children}
            </View>
        </View>
    );

    const Paragraph = ({ children }) => (
        <Text className="text-gray-600 dark:text-gray-400 text-sm leading-6 mb-2">{children}</Text>
    );

    const BulletPoint = ({ text }) => (
        <View className="flex-row mb-1.5 pl-1">
            <Text className="text-blue-500 mr-2 text-sm">•</Text>
            <Text className="text-gray-600 dark:text-gray-400 text-sm leading-6 flex-1">{text}</Text>
        </View>
    );

    const termsContent = (
        <>
            <SectionBlock title="1. Acceptance of Terms">
                <Paragraph>
                    By downloading, accessing, or using the Tourist Guide mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.
                </Paragraph>
                <Paragraph>
                    We reserve the right to update these Terms at any time. Continued use of the App after changes constitutes acceptance of the updated Terms.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="2. Use of the App">
                <Paragraph>The App is designed to help tourists explore Sri Lanka by providing:</Paragraph>
                <BulletPoint text="Attraction and destination information" />
                <BulletPoint text="Hotel and restaurant recommendations" />
                <BulletPoint text="Photo spot suggestions" />
                <BulletPoint text="Trip planning and scheduling tools" />
                <BulletPoint text="Festival and event information" />
                <Paragraph>
                    You agree to use the App only for lawful purposes and in accordance with these Terms. You must not misuse the App or attempt to access it through unauthorized means.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="3. User Accounts">
                <Paragraph>
                    To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </Paragraph>
                <BulletPoint text="You must provide accurate and complete registration information" />
                <BulletPoint text="You must be at least 13 years old to create an account" />
                <BulletPoint text="You must promptly update your information if it changes" />
                <BulletPoint text="You must notify us immediately of any unauthorized access" />
            </SectionBlock>

            <SectionBlock title="4. User Content">
                <Paragraph>
                    You may submit reviews, ratings, photos, and other content ("User Content"). By submitting User Content, you grant us a non-exclusive, royalty-free, worldwide license to use, display, and distribute your content within the App.
                </Paragraph>
                <Paragraph>
                    You agree not to submit content that is illegal, offensive, misleading, or infringes on the intellectual property rights of others.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="5. Location Services">
                <Paragraph>
                    The App may request access to your device's location services to provide personalized recommendations and navigation features. You can enable or disable location services at any time through your device settings or the App's settings page.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="6. Disclaimers">
                <Paragraph>
                    The App provides information for general guidance only. We make no warranties about the accuracy, completeness, or reliability of any information, including hotel availability, restaurant hours, attraction details, or route suggestions.
                </Paragraph>
                <Paragraph>
                    Tourist Guide is not responsible for any decisions made based on the information provided in the App. Always verify critical details directly with service providers.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="7. Limitation of Liability">
                <Paragraph>
                    To the fullest extent permitted by law, Tourist Guide shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the App, even if we have been advised of the possibility of such damages.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="8. Termination">
                <Paragraph>
                    We may suspend or terminate your access to the App at any time, with or without cause or notice. Upon termination, your right to use the App ceases immediately, and you must delete all copies of the App from your devices.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="9. Governing Law">
                <Paragraph>
                    These Terms are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising from these Terms or the use of the App shall be subject to the exclusive jurisdiction of the courts in Colombo, Sri Lanka.
                </Paragraph>
            </SectionBlock>
        </>
    );

    const privacyContent = (
        <>
            <SectionBlock title="1. Information We Collect">
                <Paragraph>We collect the following types of information to provide and improve our services:</Paragraph>
                <View className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 mb-3 border border-blue-100 dark:border-blue-800">
                    <Text className="text-blue-700 dark:text-blue-300 text-sm font-semibold mb-1">Personal Information</Text>
                    <BulletPoint text="Name, email address, and profile photo" />
                    <BulletPoint text="Travel preferences and interests" />
                    <BulletPoint text="Account credentials (encrypted)" />
                </View>
                <View className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 mb-3 border border-purple-100 dark:border-purple-800">
                    <Text className="text-purple-700 dark:text-purple-300 text-sm font-semibold mb-1">Usage Data</Text>
                    <BulletPoint text="Pages visited and features used" />
                    <BulletPoint text="Search queries and saved places" />
                    <BulletPoint text="Device type and operating system" />
                </View>
                <View className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-100 dark:border-green-800">
                    <Text className="text-green-700 dark:text-green-300 text-sm font-semibold mb-1">Location Data</Text>
                    <BulletPoint text="GPS coordinates (when location services are enabled)" />
                    <BulletPoint text="Approximate location for regional recommendations" />
                </View>
            </SectionBlock>

            <SectionBlock title="2. How We Use Your Information">
                <Paragraph>Your information is used to:</Paragraph>
                <BulletPoint text="Provide personalized travel recommendations" />
                <BulletPoint text="Power dynamic route suggestions based on your location" />
                <BulletPoint text="Improve app features and user experience" />
                <BulletPoint text="Send important service updates and notifications" />
                <BulletPoint text="Respond to your support inquiries" />
                <BulletPoint text="Ensure the security and integrity of our services" />
            </SectionBlock>

            <SectionBlock title="3. Data Sharing">
                <Paragraph>
                    We do not sell your personal information to third parties. We may share your data only in the following circumstances:
                </Paragraph>
                <BulletPoint text="With service providers who assist in app operations (hosting, analytics)" />
                <BulletPoint text="When required by law or to protect our legal rights" />
                <BulletPoint text="With your explicit consent" />
                <BulletPoint text="In anonymized, aggregated form for research and analytics" />
            </SectionBlock>

            <SectionBlock title="4. Data Security">
                <Paragraph>
                    We implement industry-standard security measures to protect your personal information, including:
                </Paragraph>
                <BulletPoint text="End-to-end encryption for sensitive data" />
                <BulletPoint text="Secure server infrastructure with regular audits" />
                <BulletPoint text="Password hashing using bcrypt algorithms" />
                <BulletPoint text="Regular security assessments and vulnerability testing" />
            </SectionBlock>

            <SectionBlock title="5. Data Retention">
                <Paragraph>
                    We retain your personal data for as long as your account is active or as needed to provide services. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="6. Your Rights">
                <Paragraph>You have the right to:</Paragraph>
                <BulletPoint text="Access and review the personal data we hold about you" />
                <BulletPoint text="Request correction of inaccurate data" />
                <BulletPoint text="Request deletion of your account and data" />
                <BulletPoint text="Withdraw consent for data processing at any time" />
                <BulletPoint text="Export your data in a portable format" />
                <Paragraph>
                    To exercise these rights, please contact us at privacy@touristguide.lk or through the Contact Support page.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="7. Cookies & Local Storage">
                <Paragraph>
                    The App uses AsyncStorage and similar technologies to save your preferences, settings, and session data locally on your device. This data is not transmitted to external servers unless explicitly stated.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="8. Children's Privacy">
                <Paragraph>
                    The App is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us so we can take appropriate action.
                </Paragraph>
            </SectionBlock>

            <SectionBlock title="9. Changes to This Policy">
                <Paragraph>
                    We may update this Privacy Policy from time to time. We will notify you of significant changes through the App or via email. The "Last Updated" date at the top of this page indicates when the policy was last revised.
                </Paragraph>
            </SectionBlock>
        </>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-gray-900" edges={['top', 'left', 'right']}>
                {/* Header */}
                <View className="flex-row items-center px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 mr-2">
                        <Text className="text-gray-500 dark:text-gray-400 text-xl font-medium">‹</Text>
                    </TouchableOpacity>
                    <Image 
                        source={document} 
                        className="w-6 h-6 mr-3 opacity-80" 
                        style={isDark ? { tintColor: 'white' } : {}}
                    />
                    <Text className="text-gray-900 dark:text-white text-lg font-bold">Terms & Privacy</Text>
                </View>

                {/* Tab Switcher */}
                <View className="flex-row px-5 pt-4 pb-2">
                    <TouchableOpacity 
                        onPress={() => setActiveTab('terms')}
                        className={`flex-1 mr-1.5 py-3 rounded-xl items-center border ${
                            activeTab === 'terms' 
                                ? 'bg-blue-600 border-blue-600' 
                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                        }`}
                        style={{ elevation: activeTab === 'terms' ? 2 : (isDark ? 0 : 1) }}
                    >
                        <View className="flex-row items-center justify-center">
                            <Image source={clipboardIcon} className="w-4 h-4 mr-1.5" style={{ tintColor: activeTab === 'terms' ? '#ffffff' : (isDark ? '#9CA3AF' : '#6B7280') }} />
                            <Text className={`font-bold text-sm ${activeTab === 'terms' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>Terms of Service</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setActiveTab('privacy')}
                        className={`flex-1 ml-1.5 py-3 rounded-xl items-center border ${
                            activeTab === 'privacy' 
                                ? 'bg-blue-600 border-blue-600' 
                                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                        }`}
                        style={{ elevation: activeTab === 'privacy' ? 2 : (isDark ? 0 : 1) }}
                    >
                        <View className="flex-row items-center justify-center">
                            <Image source={padlockIcon} className="w-4 h-4 mr-1.5" style={{ tintColor: activeTab === 'privacy' ? '#ffffff' : (isDark ? '#9CA3AF' : '#6B7280') }} />
                            <Text className={`font-bold text-sm ${activeTab === 'privacy' ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>Privacy Policy</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                    
                    {/* Last updated badge */}
                    <View className="flex-row items-center mb-5">
                        <View className="bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700">
                            <Text className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                                Last updated: July 15, 2026
                            </Text>
                        </View>
                    </View>

                    {activeTab === 'terms' ? termsContent : privacyContent}

                    {/* Contact footer */}
                    <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 items-center mt-2 border border-gray-100 dark:border-gray-700">
                        <Text className="text-gray-900 dark:text-white text-sm font-bold">Questions about these policies?</Text>
                        <Text className="text-gray-400 dark:text-gray-500 text-xs mt-1 text-center">
                            Reach out to our legal team at legal@touristguide.lk
                        </Text>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('ContactSupport')}
                            className="bg-blue-600 rounded-xl px-8 py-3 mt-4"
                        >
                            <Text className="text-white font-bold text-sm">Contact Us</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
