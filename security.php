* @Security("is_granted('ROLE_USER') ")
or 
@IsGranted("ROLE_ADMIN")


@Security("is_granted('ROLE_EDITER') or  (is_granted('ROLE_USER') and user==post.getUser())")



in twig 
{% if is_granted('ROLE_ADMIN') %}
    <a href="...">Delete</a>
{% endif %}