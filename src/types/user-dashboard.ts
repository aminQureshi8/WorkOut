export interface UserDashboardProps {
  initialUser: {
    name: string;
    avatar: string;
    email: string;
    level: string;
    joinDate: string;
    coachName: string;
  };
  initialSubscription: {
    packageName: string;
    status: string;
    daysRemaining: number;
    totalDays: number;
    endDate: string;
    nextPayment: string;
  } | null;
  initialWorkouts: {
    day: string;
    type: string;
    duration: string;
    done: boolean;
    sets: number;
  }[];
  initialTickets: {
    id: string;
    subject: string;
    status: string;
    rawStatus: string;
    time: string;
  }[];
  initialWishlist?: {
    id: string;
    title: string;
    slug: string;
    image: string;
    category: string;
    views: number;
  }[];
}
