from django import template

register = template.Library()

@register.filter
def extract_uid_token(value):
    """
    Custom Django template filter to extract the UID and token from a URL.

    Args:
        value (str): The input URL string.

    Returns:
        str: A string containing the UID and token separated by '/' if found in the URL.
            An empty string is returned if the URL doesn't contain the required parts.

    Example:
        If value is "http://example.com/api/12/aa23/", the function returns "12/aa23/".

    """
    parts = value.split('/')
    if len(parts) >= 3:
        return f'{parts[-3]}/{parts[-2]}/'
    return ''
