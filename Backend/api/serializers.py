from rest_framework import serializers
from .models import Employee, Attendance

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_id = serializers.SlugRelatedField(
        source='employee',
        slug_field='employee_id',
        queryset=Employee.objects.all(),
        error_messages={
            'does_not_exist': 'Employee ID does not exist.',
            'invalid': 'Employee ID is invalid.',
        },
    )

    class Meta:
        model = Attendance
        fields = ['id', 'employee_id', 'full_name', 'date', 'status', 'created_at']
        validators = []

    def create(self, validated_data):
        employee = validated_data['employee']
        attendance, created = Attendance.objects.update_or_create(
            employee=employee,
            date=validated_data['date'],
            defaults={'status': validated_data['status']}
        )
        attendance._was_created = created
        return attendance

    def update(self, instance, validated_data):
        employee = validated_data.pop('employee', None)
        if employee:
            instance.employee = employee
        instance.status = validated_data.get('status', instance.status)
        instance.date = validated_data.get('date', instance.date)
        instance.save()
        return instance
