<template>
    <div class="d-flex align-center justify-space-between pa-4">
        <!-- Previous Page Button -->
        <v-btn
            :disabled="loading || isPrevDisabled"
            @click="$emit('previous')"
            prepend-icon="mdi-chevron-left"
            variant="text"
            class="prev-btn"
        >
            Previous
        </v-btn>

        <!-- Items Per Page Selector -->
        <div class="d-flex align-center">
            <span class="mr-4">Items per page:</span>
            <v-select
                v-model="localPageSize"
                :items="pageSizeOptions"
                variant="outlined"
                density="compact"
                hide-details
                class="page-size-select"
                @update:model-value="handlePageSizeChange"
            ></v-select>
            
            <!-- Optional: Show current page info -->
            <span class="ml-4 text-caption">
                {{ startIndex }}-{{ endIndex }} of {{ totalItems }}
            </span>
        </div>

        <!-- Next Page Button -->
        <v-btn
            :disabled="loading || isNextDisabled"
            @click="$emit('next')"
            append-icon="mdi-chevron-right"
            variant="text"
            class="next-btn"
        >
            Next
        </v-btn>
    </div>
</template>

<script>
export default {
    name: 'UserPagination',

    props: {
        // Loading state to disable controls during data fetch
        loading: {
            type: Boolean,
            default: false
        },
        // Disable previous button on first page
        isPrevDisabled: {
            type: Boolean,
            default: true
        },
        // Disable next button on last page
        isNextDisabled: {
            type: Boolean,
            default: false
        },
        // Current page size
        pageSize: {
            type: Number,
            default: 10
        },
        // Total number of items (optional)
        totalItems: {
            type: Number,
            default: 0
        },
        // Current page number (optional)
        currentPage: {
            type: Number,
            default: 1
        }
    },

    emits: [
        'previous',    // Emit when previous button clicked
        'next',       // Emit when next button clicked
        'update:pageSize' // Emit when page size changes
    ],

    data() {
        return {
            localPageSize: this.pageSize,
            pageSizeOptions: [5, 10, 15, 20, 25, 50],
        }
    },

    computed: {
        // Calculate start index for current page
        startIndex() {
            return ((this.currentPage - 1) * this.pageSize) + 1
        },
        // Calculate end index for current page
        endIndex() {
            const end = this.startIndex + this.pageSize - 1
            return Math.min(end, this.totalItems)
        }
    },

    methods: {
        // Handle page size change
        handlePageSizeChange(newSize) {
            this.localPageSize = newSize
            this.$emit('update:pageSize', newSize)
        },

        // Reset pagination (can be called from parent)
        reset() {
            this.localPageSize = this.pageSize
        }
    },

    watch: {
        // Keep local page size in sync with prop
        pageSize: {
            handler(newVal) {
                this.localPageSize = newVal
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
.page-size-select {
    width: 100px;
}

/* Optional: Add hover effects to buttons */
.prev-btn:not(:disabled),
.next-btn:not(:disabled) {
    transition: opacity 0.2s;
}

.prev-btn:not(:disabled):hover,
.next-btn:not(:disabled):hover {
    opacity: 0.8;
}

/* Optional: Add responsive styles */
@media (max-width: 600px) {
    .d-flex {
        flex-direction: column;
        gap: 16px;
    }

    .page-size-select {
        width: 80px;
    }
}
</style> 