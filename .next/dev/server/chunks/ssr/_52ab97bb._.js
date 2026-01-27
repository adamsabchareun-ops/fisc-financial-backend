module.exports = [
"[project]/src/utils/finance.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateProjections",
    ()=>calculateProjections
]);
const calculateProjections = (income, buckets)=>{
    // If no income or negative, return buckets with projected = current
    if (!income || income <= 0) {
        return buckets.map((b)=>({
                ...b,
                projected_balance: b.current_balance || 0
            }));
    }
    return buckets.map((bucket)=>{
        // 1. Calculate share based on the Database Percentage (e.g., 50)
        // We expect bucket.percentage to be a number like 50, 30, 20.
        const percentage = bucket.percentage || 0;
        let potentialAdd = income * (percentage / 100);
        // 2. Round down to 2 decimals immediately (Money Logic)
        // This prevents numbers like 322.581
        potentialAdd = Math.floor(potentialAdd * 100) / 100;
        const currentBalance = bucket.current_balance || 0;
        // 3. HARD CAP RULE:
        // Calculate how much space is strictly left in the bucket.
        const spaceRemaining = Math.max(0, bucket.target_amount - currentBalance);
        // 4. The actual amount to add is the smaller of:
        //    a) The calculated percentage share
        //    b) The remaining space (to prevent overflow)
        const actualAdd = Math.min(potentialAdd, spaceRemaining);
        return {
            ...bucket,
            projected_balance: currentBalance + actualAdd
        };
    });
};
}),
"[project]/src/app/actions/allocate.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"70649e00ac30b0421d1341c642b7ec0b860a4a3de3":"allocateIncome"},"",""] */ __turbopack_context__.s([
    "allocateIncome",
    ()=>allocateIncome
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$finance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/finance.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
// Initialize Supabase Admin Client (Service Role)
// This bypasses RLS to ensure we can update any user's data securely from the server
const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(("TURBOPACK compile-time value", "http://127.0.0.1:54321"), process.env.SUPABASE_SERVICE_ROLE_KEY);
async function allocateIncome(userId, income, buckets) {
    try {
        if (!income || income <= 0) {
            throw new Error("Invalid income amount.");
        }
        if (!buckets || buckets.length === 0) {
            throw new Error("No buckets to allocate to.");
        }
        // Get authenticated user
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            throw new Error("Unauthorized");
        }
        const realUserId = user.id;
        // 1. Recalculate projections server-side for safety
        // We trust the bucket IDs and Targets from the client (for now), but we recalculate the split.
        // In a real app, we might re-fetch buckets from DB to ensure targets haven't changed.
        // For this MVP, we'll use the passed buckets but recalculate the math.
        const projectedBuckets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$finance$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["calculateProjections"])(income, buckets);
        // 2. Perform updates sequentially
        // Supabase doesn't support multi-table transactions via JS client easily without RPC.
        // Sequential updates are fine for this scale.
        const updates = projectedBuckets.map(async (bucket)=>{
            // Only update if there's a change or strictly if projected > current?
            // Actually, we want to commit the projected_balance as the new current_balance.
            const { error } = await supabase.from('allocation_buckets').update({
                current_balance: bucket.projected_balance
            }).eq('id', bucket.id).eq('user_id', realUserId); // Ensure we only touch rows for this user
            if (error) {
                console.error(`Failed to update bucket ${bucket.name}:`, error);
                throw new Error(`Failed to update bucket ${bucket.name}`);
            }
        });
        await Promise.all(updates);
        // 3. Revalidate the dashboard
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/horizon');
        return {
            success: true
        };
    } catch (error) {
        console.error("Allocation Error:", error);
        return {
            success: false,
            error: error.message
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    allocateIncome
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(allocateIncome, "70649e00ac30b0421d1341c642b7ec0b860a4a3de3", null);
}),
"[project]/.next-internal/server/app/horizon/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/allocate.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$allocate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/allocate.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/horizon/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/allocate.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "70649e00ac30b0421d1341c642b7ec0b860a4a3de3",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$allocate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["allocateIncome"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$horizon$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$allocate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/horizon/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/allocate.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$allocate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/allocate.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_52ab97bb._.js.map