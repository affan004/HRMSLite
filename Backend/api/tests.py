from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Attendance, Employee


class EmployeeApiTests(APITestCase):
    def test_create_employee(self):
        response = self.client.post(
            reverse('employee-list'),
            {
                'employee_id': 'EMP001',
                'full_name': 'Aman Gupta',
                'email': 'aman@example.com',
                'department': 'Engineering',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 1)

    def test_duplicate_employee_id_returns_400(self):
        Employee.objects.create(
            employee_id='EMP001',
            full_name='Aman Gupta',
            email='aman@example.com',
            department='Engineering',
        )

        response = self.client.post(
            reverse('employee-list'),
            {
                'employee_id': 'EMP001',
                'full_name': 'Anya Sharma',
                'email': 'anya@example.com',
                'department': 'Product',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('employee_id', response.data)


class AttendanceApiTests(APITestCase):
    def setUp(self):
        self.employee = Employee.objects.create(
            employee_id='EMP001',
            full_name='Aman Gupta',
            email='aman@example.com',
            department='Engineering',
        )

    def test_attendance_rejects_unknown_employee(self):
        response = self.client.post(
            reverse('attendance-list'),
            {
                'employee_id': 'EMP404',
                'date': '2026-03-10',
                'status': 'Present',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['employee_id'][0], 'Employee ID does not exist.')

    def test_attendance_upsert_updates_existing_record(self):
        first_response = self.client.post(
            reverse('attendance-list'),
            {
                'employee_id': self.employee.employee_id,
                'date': '2026-03-10',
                'status': 'Present',
            },
            format='json',
        )
        second_response = self.client.post(
            reverse('attendance-list'),
            {
                'employee_id': self.employee.employee_id,
                'date': '2026-03-10',
                'status': 'Absent',
            },
            format='json',
        )

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        self.assertEqual(Attendance.objects.count(), 1)
        self.assertEqual(Attendance.objects.get().status, 'Absent')
