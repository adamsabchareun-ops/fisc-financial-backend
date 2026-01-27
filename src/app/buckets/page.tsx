import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CreateBucketForm } from '@/components/buckets/CreateBucketForm';
import { DeleteBucketButton } from '@/components/buckets/DeleteBucketButton';

export default async function BucketsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    const { data: buckets, error } = await supabase
        .from('allocation_buckets')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

    if (error) {
        console.error("Error fetching buckets:", error);
    }

    return (
        <main className="min-h-screen bg-[#F9F9F7] p-8 md:p-10 font-sans text-[#2D2D2D]">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <Link href="/horizon" className="text-sm font-medium text-gray-500 hover:text-primary-green mb-2 inline-flex items-center">
                            ← Back to Dashboard
                        </Link>
                        <h1 className="text-3xl md:text-4xl font-bold text-text-charcoal tracking-tight mt-2">
                            Manage Allocations
                        </h1>
                    </div>
                    <CreateBucketForm />
                </header>

                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E0E0E0]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="py-4 px-2 font-medium text-gray-500 text-sm">Name</th>
                                    <th className="py-4 px-2 font-medium text-gray-500 text-sm">Percentage</th>
                                    <th className="py-4 px-2 font-medium text-gray-500 text-sm">Goal</th>
                                    <th className="py-4 px-2 font-medium text-gray-500 text-sm">Current Balance</th>
                                    <th className="py-4 px-2 font-medium text-gray-500 text-sm"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {buckets && buckets.length > 0 ? (
                                    buckets.map((bucket) => (
                                        <tr key={bucket.id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-2 font-medium text-text-charcoal">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: bucket.color_hex || '#E5E7EB' }} />
                                                    {bucket.name}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-text-charcoal">
                                                {bucket.percentage ? `${bucket.percentage}%` : '-'}
                                            </td>
                                            <td className="py-4 px-2 text-text-charcoal">
                                                ${bucket.target_amount?.toLocaleString() ?? 0}
                                            </td>
                                            <td className="py-4 px-2 text-text-charcoal font-medium">
                                                ${bucket.current_balance?.toLocaleString() ?? 0}
                                            </td>
                                            <td className="py-4 px-2 text-right">
                                                <DeleteBucketButton id={bucket.id} name={bucket.name} />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-500">
                                            No buckets found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
