<template>
    <v-dialog v-model="dialogModel" max-width="500px">
        <v-card>
            <v-card-title>{{ isEditing ? "Edit User" : "Add User" }}</v-card-title>
            <v-card-text>
                <v-form ref="form" v-model="isValid">
                    <v-text-field
                        v-model="formData.name"
                        label="Name"
                        :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field
                        v-model="formData.email"
                        label="Email"
                        :rules="[rules.required, rules.email]"
                    ></v-text-field>
                    <v-select
                        v-model="formData.role"
                        :items="roles"
                        label="Role"
                        :rules="[rules.required]"
                    ></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="close">Cancel</v-btn>
                <v-btn
                    color="primary"
                    text
                    :disabled="!isValid"
                    @click="save"
                >
                    {{ isEditing ? "Save Changes" : "Add User" }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: {
        modelValue: Boolean,
        user: Object,
        isEditing: Boolean
    },
    emits: ['update:modelValue', 'save'],
    data() {
        return {
            formData: this.initializeForm(),
            roles: ['admin', 'teacher', 'student', 'user'],
            isValid: false,
            rules: {
                required: v => !!v || 'This field is Required',
                email: v => /.+@.+\..+/.test(v) || 'Invalid email'
            }
        }
    },
    computed: {
        dialogModel: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }
    },
    watch: {
        user: {
            handler(newUser) {
                this.formData = this.initializeForm()
            },
            deep: true
        }
    },
    methods: {
        initializeForm() {
            return this.user ? { ...this.user } : { name: '', email: '', role: '' }
        },
        close() {
            this.$emit('update:modelValue', false)
        },
        save() {
            if (this.$refs.form.validate()) {
                this.$emit('save', this.formData)
                this.close()
            }
        }
    }
}
</script> 