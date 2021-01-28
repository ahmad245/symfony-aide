config.yaml or config /packages/security.yaml
  redirect admin after login using             
   form_login:
                
            default_target_path: after_login_route_name

example 
firewalls:
        dev:
            pattern: ^/(_(profiler|wdt)|css|images|js)/
            security: false

        admin:
                pattern: ^/admin
                anonymous: lazy
                provider: in_database
                form_login:
                    login_path: admin_account_login
                    check_path : admin_account_login 
                    default_target_path: /admin
                    always_use_default_target_path: true
                    failure_path: login_failure_route_name
                    use_referer: true
                    
                logout:
                    path: admin_account_logout
                    target: admin_account_login 
    
                user_checker: App\Security\UserEnabledChecker                  
        main:
            anonymous: lazy

            provider: in_database
            form_login:
               login_path: account_login
               check_path: account_login
               default_target_path: home 
               always_use_default_target_path: true
               use_referer: true
               
            logout:
                path: account_logout
                target: account_login    

            user_checker: App\Security\UserEnabledChecker

access_control:
         - { path: ^/admin/login, roles: IS_AUTHENTICATED_ANONYMOUSLY }
         - { path: ^/admin, roles: ROLE_ADMIN }
      
role_hierarchy:
            ROLE_WRITER: ROLE_USER
            ROLE_ADMIN: [ROLE_WRITER, ROLE_EDITER]
            ROLE_SUPERADMIN: ROLE_ADMIN     


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 // using form 
 {# <form action="{{ path('login') }}" method="post">
    {# ... #}

    <input type="hidden" name="_target_path" value="{{ path('account') }}"/>
    <input type="submit" name="login"/>
</form>            #}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//using controller 
use Symfony\Component\Routing\RouterInterface;

return  $this->redirectToRoute('name of route')
or 
 inside constructor 
 private $router;
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }
return new RedirectResponse($this->router->generate('name of route'))

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
based on role 
inside config 
  default_target_path :homepage
 
 inside controller 
  /**
   * @Route("/secure",name="homepage")
   */
   public function indexAction(){
       if($this->getUser()->hasRole('ROLE_ADMIN'))
          return $this->redirectToRout('admin-area') // return $this->redirect($this->generetUrl('admin-area'))
    elseif($this->getUser()->hasRole('ROLE_USER'))
        return $this->redirect($this->generateUrl('client_area'));
    throw new \Exception(AccessDeniedException::class);  
   }

// or 

/**
     * @var \Symfony\Component\Routing\RouterInterface
     */
    private $router;

    /**
     * @param RouterInterface $router
     */
    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    /**
     * @param Request $request
     * @param TokenInterface $token
     * @return RedirectResponse
     */
    public function onAuthenticationSuccess(Request $request, TokenInterface $token)
    {
        // Get list of roles for current user
        $roles = $token->getRoles();
        // Tranform this list in array
        $rolesTab = array_map(function($role){ 
          return $role->getRole(); 
        }, $roles);
        // If is a admin or super admin we redirect to the backoffice area
        if (in_array('ROLE_ADMIN', $rolesTab, true) || in_array('ROLE_SUPER_ADMIN', $rolesTab, true))
            $redirection = new RedirectResponse($this->router->generate('backoffice_homepage'));
        // otherwise, if is a commercial user we redirect to the crm area
        elseif (in_array('ROLE_COMMERCIAL', $rolesTab, true))
            $redirection = new RedirectResponse($this->router->generate('crm_homepage'));
        // otherwise we redirect user to the member area
        else
            $redirection = new RedirectResponse($this->router->generate('member_homepage'));
        
        return $redirection;
    }
} 




//////////////////////////////////////////////////////////////////////////////////////////////////////////

// get user role using controller
 
$this->getUser()->haseRole('role name')
or 

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
public function onAuthenticationSuccess(Request $request, TokenInterface $token){
    // Get list of roles for current user
        $roles = $token->getRoles();
}
or
public function getRoles(UserInterface $user) {
        return $user->getRoles();
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// get user role using twig 
{% if is_granted('ROLE_ADMIN') %} ... {% endif %}
{% if is_granted('ROLE_ADMIN') == true %} ... {% endif %}
{% if is_granted('ROLE_ADMIN') == false %} ... {% endif %}
///////////////////////////////
{% if is_granted('ROLE_ADMIN') %}
    Administrator
{% elseif is_granted('ROLE_USER') %}
    User
{% else %}
    Anonymous
{% endif %}
///////////////
app.user.roles
% if app.user is not null %}
  {% for role in app.user.roles if role != 'ROLE_ADMIN' %}
      {{ role }} //ROLE_USER
  {% endfor %}
{% endif %}

/////////////////////////
app.security.token.roles
///////////////////////////////////////////////////////////////////////

Class User implements UserInterface {
    ...
    public function isGranted($role)
    {
        return in_array($role, $this->getRoles());
    }
}
in controller 
$user->isGranted("USER_ADMIN")
Or in Twig:
user.granted("USER_ADMIN")
app.user.granted("USER_ADMIN")

Note 2: this code may throw an exception if you use it outside the secured area of your app, since app.user would be NULL.
<?php 

 // 

?>