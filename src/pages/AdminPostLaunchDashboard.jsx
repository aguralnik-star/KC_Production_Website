import { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import PageHead from '../components/PageHead';
import AdminLayout from '../components/admin/AdminLayout';
import AccessibleButton from '../components/AccessibleButton';
import PostLaunchExecutiveSummary from '../components/postlaunch/PostLaunchExecutiveSummary';
import PostLaunchKPICards from '../components/postlaunch/PostLaunchKPICards';
import PostLaunchTrafficOverview from '../components/postlaunch/PostLaunchTrafficOverview';
import PostLaunchRFQMetrics from '../components/postlaunch/PostLaunchRFQMetrics';
import PostLaunchConversionFunnel from '../components/postlaunch/PostLaunchConversionFunnel';
import PostLaunchPagePerformance from '../components/postlaunch/PostLaunchPagePerformance';
import PostLaunchRecommendationCenter from '../components/postlaunch/PostLaunchRecommendationCenter';
import PostLaunchIssueTracker from '../components/postlaunch/PostLaunchIssueTracker';
import PostLaunchDailyChecklist from '../components/postlaunch/PostLaunchDailyChecklist';
import PostLaunchActivityFeed from '../components/postlaunch/PostLaunchActivityFeed';
import {
  createPostLaunchIssue,
  refreshPostLaunchDashboardData,
  savePostLaunchDailyReview,
  updatePostLaunchIssue,
} from '../services/postLaunchMonitoringService';

export default function AdminPostLaunchDashboard() {
  const { session, handleSignOut } = useOutletContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');

    try {
      const nextData = await refreshPostLaunchDashboardData();
      setData(nextData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load post-launch dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateIssue = async (payload) => {
    setSaving(true);
    setError('');
    try {
      await createPostLaunchIssue(payload);
      await loadData(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create issue.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateIssue = async (id, updates) => {
    setSaving(true);
    setError('');
    try {
      await updatePostLaunchIssue(id, updates);
      await loadData(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update issue.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveReview = async (review) => {
    setSaving(true);
    setError('');
    try {
      await savePostLaunchDailyReview(review);
      await loadData(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save daily review.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Post-Launch Monitoring">
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" aria-label="Loading post-launch dashboard" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <PageHead
        title="Post-Launch Monitoring | K&C Design and Manufacturing"
        description="Seven-day post-launch RFQ monitoring and conversion optimization dashboard."
      />

      <AdminLayout email={session?.user?.email} onSignOut={handleSignOut} title="Post-Launch Monitoring">
        <div className="space-y-8">
          <PostLaunchExecutiveSummary
            status={data?.executiveStatus}
            launchDay={data?.launchDay}
            refreshedAt={data?.refreshedAt}
            kpi={data?.kpi}
          />

          <div className="flex justify-end">
            <AccessibleButton type="button" onClick={() => loadData(true)} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
              Refresh
            </AccessibleButton>
          </div>

          {error ? (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          ) : null}

          <PostLaunchKPICards kpi={data?.kpi} />

          <div className="grid gap-6 xl:grid-cols-2">
            <PostLaunchConversionFunnel steps={data?.funnelSteps} />
            <PostLaunchRFQMetrics metrics={data?.rfqMetrics} />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <PostLaunchTrafficOverview pagePerformance={data?.pagePerformance} />
            <PostLaunchRecommendationCenter recommendations={data?.recommendations} />
          </div>

          <PostLaunchPagePerformance rows={data?.pagePerformance} />

          <div className="grid gap-6 xl:grid-cols-2">
            <PostLaunchIssueTracker
              issues={data?.issues}
              onCreateIssue={handleCreateIssue}
              onUpdateIssue={handleUpdateIssue}
              saving={saving}
            />
            <PostLaunchDailyChecklist
              launchDay={data?.launchDay}
              dailyReviews={data?.dailyReviews}
              onSaveReview={handleSaveReview}
              saving={saving}
            />
          </div>

          <PostLaunchActivityFeed activity={data?.activity} />
        </div>
      </AdminLayout>
    </>
  );
}
