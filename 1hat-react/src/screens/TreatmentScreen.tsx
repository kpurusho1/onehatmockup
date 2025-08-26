import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

// Types for treatment plans
type TreatmentPlan = {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  steps: TreatmentStep[];
  popularity: number;
};

type TreatmentStep = {
  id: string;
  title: string;
  description: string;
  duration?: string;
  completed?: boolean;
};

// Mock data for treatment plans
const mockTreatmentPlans: TreatmentPlan[] = [
  {
    id: '1',
    name: 'Hypertension Management',
    description: 'Comprehensive plan for managing high blood pressure through medication, diet, and lifestyle changes.',
    category: 'Cardiovascular',
    duration: '3 months',
    popularity: 89,
    steps: [
      {
        id: '1-1',
        title: 'Initial Assessment',
        description: 'Complete blood work, ECG, and physical examination.',
        duration: '1 week',
      },
      {
        id: '1-2',
        title: 'Medication Regimen',
        description: 'Daily antihypertensive medication as prescribed.',
        duration: '3 months',
      },
      {
        id: '1-3',
        title: 'Dietary Modifications',
        description: 'Reduce sodium intake, increase potassium-rich foods, follow DASH diet.',
        duration: '3 months',
      },
      {
        id: '1-4',
        title: 'Physical Activity',
        description: '30 minutes of moderate exercise 5 days per week.',
        duration: '3 months',
      },
      {
        id: '1-5',
        title: 'Follow-up Visits',
        description: 'Bi-weekly blood pressure checks and monthly consultations.',
        duration: '3 months',
      },
    ],
  },
  {
    id: '2',
    name: 'Type 2 Diabetes Care',
    description: 'Structured approach to managing blood glucose levels and preventing complications.',
    category: 'Endocrinology',
    duration: '6 months',
    popularity: 76,
    steps: [
      {
        id: '2-1',
        title: 'Glucose Monitoring',
        description: 'Regular blood glucose testing as recommended.',
        duration: '6 months',
      },
      {
        id: '2-2',
        title: 'Medication Adherence',
        description: 'Take prescribed medications at scheduled times.',
        duration: '6 months',
      },
      {
        id: '2-3',
        title: 'Carbohydrate Management',
        description: 'Count carbs and maintain consistent carb intake at meals.',
        duration: '6 months',
      },
      {
        id: '2-4',
        title: 'Regular Exercise',
        description: '150 minutes of moderate-intensity exercise per week.',
        duration: '6 months',
      },
    ],
  },
  {
    id: '3',
    name: 'Post-Surgery Recovery',
    description: 'Step-by-step recovery plan after general surgery to ensure proper healing and prevent complications.',
    category: 'Surgery',
    duration: '4 weeks',
    popularity: 92,
    steps: [
      {
        id: '3-1',
        title: 'Wound Care',
        description: 'Daily cleaning and dressing changes as instructed.',
        duration: '2 weeks',
      },
      {
        id: '3-2',
        title: 'Pain Management',
        description: 'Take prescribed pain medication as needed and track pain levels.',
        duration: '1-2 weeks',
      },
      {
        id: '3-3',
        title: 'Gradual Activity Increase',
        description: 'Follow the prescribed schedule for returning to normal activities.',
        duration: '4 weeks',
      },
      {
        id: '3-4',
        title: 'Nutrition Plan',
        description: 'Follow high-protein, nutrient-dense diet to support healing.',
        duration: '4 weeks',
      },
    ],
  },
];

interface TreatmentScreenProps {
  navigation?: any;
}

const TreatmentScreen: React.FC<TreatmentScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);

  const categories = Array.from(new Set(mockTreatmentPlans.map(plan => plan.category)));

  const filteredPlans = mockTreatmentPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || plan.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAssignPlan = (plan: TreatmentPlan) => {
    // In a real app, this would assign the plan to a patient
    alert(`${plan.name} would be assigned to a patient`);
  };

  const renderTreatmentPlanDetails = () => {
    if (!selectedPlan) return null;

    return (
      <View style={styles.planDetailsContainer}>
        <View style={styles.planDetailsHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedPlan(null)}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.planDetailsTitle}>{selectedPlan.name}</Text>
        </View>

        <View style={styles.planInfoCard}>
          <View style={styles.planInfoRow}>
            <Text style={styles.planInfoLabel}>Category:</Text>
            <Text style={styles.planInfoValue}>{selectedPlan.category}</Text>
          </View>
          <View style={styles.planInfoRow}>
            <Text style={styles.planInfoLabel}>Duration:</Text>
            <Text style={styles.planInfoValue}>{selectedPlan.duration}</Text>
          </View>
          <View style={styles.planInfoRow}>
            <Text style={styles.planInfoLabel}>Popularity:</Text>
            <View style={styles.popularityContainer}>
              <View 
                style={[styles.popularityBar, { width: `${selectedPlan.popularity}%` }]} 
              />
              <Text style={styles.popularityText}>{selectedPlan.popularity}%</Text>
            </View>
          </View>
        </View>

        <Text style={styles.planDescription}>{selectedPlan.description}</Text>

        <Text style={styles.stepsTitle}>Treatment Steps</Text>
        {selectedPlan.steps.map((step, index) => (
          <View key={step.id} style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
            </View>
            <Text style={styles.stepDescription}>{step.description}</Text>
            {step.duration && (
              <Text style={styles.stepDuration}>Duration: {step.duration}</Text>
            )}
          </View>
        ))}

        <TouchableOpacity 
          style={styles.assignButton}
          onPress={() => handleAssignPlan(selectedPlan)}
        >
          <Text style={styles.assignButtonText}>Assign to Patient</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!selectedPlan ? (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Treatment Plans</Text>
            <Text style={styles.headerSubtitle}>Browse and assign treatment protocols</Text>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search treatment plans..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            <TouchableOpacity 
              style={[styles.categoryButton, !selectedCategory && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>All</Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity 
                key={category}
                style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.plansContainer}>
            {filteredPlans.map(plan => (
              <TouchableOpacity 
                key={plan.id} 
                style={styles.planCard}
                onPress={() => setSelectedPlan(plan)}
              >
                <View style={styles.planCardContent}>
                  <View style={styles.planCardHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryBadgeText}>{plan.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.planCardDescription} numberOfLines={2}>
                    {plan.description}
                  </Text>
                  <View style={styles.planCardFooter}>
                    <Text style={styles.planDuration}>{plan.duration}</Text>
                    <Text style={styles.planSteps}>{plan.steps.length} steps</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            {filteredPlans.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🔍</Text>
                <Text style={styles.emptyStateTitle}>No Plans Found</Text>
                <Text style={styles.emptyStateText}>
                  Try adjusting your search or filters
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        renderTreatmentPlanDetails()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#1c2f7f',
    borderColor: '#1c2f7f',
  },
  categoryText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: 'white',
  },
  plansContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  planCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planCardContent: {
    padding: 16,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  planCardDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  planCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planDuration: {
    fontSize: 14,
    color: '#1c2f7f',
    fontWeight: '500',
  },
  planSteps: {
    fontSize: 14,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    maxWidth: 200,
  },
  planDetailsContainer: {
    flex: 1,
    padding: 16,
  },
  planDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  planDetailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  planInfoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planInfoLabel: {
    width: 100,
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  planInfoValue: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  popularityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    overflow: 'hidden',
  },
  popularityBar: {
    height: '100%',
    backgroundColor: '#1c2f7f',
    borderRadius: 10,
  },
  popularityText: {
    position: 'absolute',
    right: 8,
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  planDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 16,
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  stepCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1c2f7f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    paddingLeft: 36,
  },
  stepDuration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1c2f7f',
    paddingLeft: 36,
  },
  assignButton: {
    backgroundColor: '#1c2f7f',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  assignButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});

export default TreatmentScreen;
