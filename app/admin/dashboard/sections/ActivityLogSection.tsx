import React, { useState, useEffect, useRef } from 'react';

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  timestamp: string;
}

interface ActivityLogSectionProps {
  isAdmin: boolean;
  onLoaded: () => void;
}

const ActivityLogSection: React.FC<ActivityLogSectionProps> = ({ isAdmin, onLoaded }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const didFetchRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    
    const fetchActivities = async () => {
      if (didFetchRef.current) return;
      didFetchRef.current = true;
      
      try {
        setIsLoading(true);
        
        // Simulate delayed response for demonstration purposes
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const simulatedActivities: ActivityItem[] = [
          {
            id: '1',
            userId: 'user1',
            userName: 'John Doe',
            userAvatar: '/assets/avatars/user1.jpg',
            action: 'created',
            resourceType: 'post',
            resourceId: 'post1',
            resourceName: 'Getting Started with Next.js',
            timestamp: new Date(Date.now() - 15 * 60000).toISOString()
          },
          {
            id: '2',
            userId: 'user2',
            userName: 'Jane Smith',
            userAvatar: '/assets/avatars/user2.jpg',
            action: 'updated',
            resourceType: 'post',
            resourceId: 'post2',
            resourceName: 'Advanced React Patterns',
            timestamp: new Date(Date.now() - 3 * 3600000).toISOString()
          },
          {
            id: '3',
            userId: 'user1',
            userName: 'John Doe',
            userAvatar: '/assets/avatars/user1.jpg',
            action: 'deleted',
            resourceType: 'comment',
            resourceId: 'comment1',
            resourceName: 'Comment on React Hooks Tutorial',
            timestamp: new Date(Date.now() - 7 * 3600000).toISOString()
          },
          {
            id: '4',
            userId: 'user3',
            userName: 'Alex Johnson',
            action: 'published',
            resourceType: 'post',
            resourceId: 'post3',
            resourceName: 'SEO Best Practices for Blogs',
            timestamp: new Date(Date.now() - 24 * 3600000).toISOString()
          }
        ];
        
        setActivities(simulatedActivities);
        
        // Save to cache right after fetching instead of in a separate useEffect
        if (simulatedActivities.length > 0) {
          const cacheKey = 'dashboard-activity';
          sessionStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: simulatedActivities,
              timestamp: Date.now()
            })
          );
        }
      } catch (error) {
        console.error('Error fetching activity log:', error);
      } finally {
        setIsLoading(false);
        onLoaded();
      }
    };
    
    // Use cache if available
    const cacheKey = 'dashboard-activity';
    const cachedData = sessionStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        const { data, timestamp } = JSON.parse(cachedData);
        const isExpired = Date.now() - timestamp > 5 * 60 * 1000; // 5 minutes
        
        if (!isExpired) {
          setActivities(data);
          setIsLoading(false);
          onLoaded();
          return;
        }
      } catch (e) {
        // Cache error, fetch fresh data
      }
    }
    
    fetchActivities();
    
    return () => {
      controller.abort();
    };
  }, [onLoaded]);
  
  // Remove the second useEffect that was causing the infinite update loop
  
  // Get action style
  const getActionStyle = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'text-green-600 dark:text-green-400';
      case 'updated':
        return 'text-blue-600 dark:text-blue-400';
      case 'deleted':
        return 'text-red-600 dark:text-red-400';
      case 'published':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  
  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);
    
    if (diffMins < 1) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHrs < 24) {
      return `${diffHrs}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex">
              <div className="mr-3 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="w-full">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <div className="mr-3 flex-shrink-0">
                {activity.userAvatar ? (
                  <img 
                    src={activity.userAvatar} 
                    alt={activity.userName} 
                    className="h-10 w-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">
                      {activity.userName.substring(0, 1)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  <span className="font-medium">{activity.userName}</span>{' '}
                  <span className={getActionStyle(activity.action)}>{activity.action}</span>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{activity.resourceType}</span>{' '}
                  <span className="font-medium">{activity.resourceName}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No recent activity found.
        </div>
      )}
    </div>
  );
};

export default ActivityLogSection;