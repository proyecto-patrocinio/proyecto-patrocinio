import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _


class ComplexityPasswordValidator:
    """
    Validate that the password contains a mix of special characters, letters (both lowercase and uppercase), and numbers.
    """

    def validate(self, password, user=None):

        # Check if the password contains at least one lowercase letter
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("The password must contain at least one lowercase letter."),
                code="password_no_lowercase",
            )

        # Check if the password contains at least one uppercase letter
        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("The password must contain at least one uppercase letter."),
                code="password_no_uppercase",
            )

        # Check if the password contains at least one digit
        if not re.search(r'\d', password):
            raise ValidationError(
                _("The password must contain at least one digit."),
                code="password_no_digit",
            )

        # Check if the password contains at least one special character
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            raise ValidationError(
                _("The password must contain at least one special character."),
                code="password_no_special_character",
            )

    def get_help_text(self):
        return _(
            "Your password must contain a combination of uppercase and lowercase letters, numbers, and special characters."
        )
