<!-- 1-insid form passord 
->add('oldPassword',PasswordType::class)
        ->add('newPassword',PasswordType::class)
        ->add('confirmPassword',PasswordType::class)

 2- enter the old password 
   -enter the new password 
   -confirm password 
 3-insid controller 
  -  password_verify(old password , user password)
  -if not ok   $form->get('oldPassword')->addError(new FormError('password erorr'));
  -  if is ok $user->setPassword($this->encode->encodePassword($user,$password->getNewPassword()));
               $this->em->persist($user);
               $this->em->flush();
               return $this->redirectToRoute('home');


//                 -->



<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UpdatePassword;
use App\Form\UpdatePasswordType;
use App\Security\TokenGenerator;
use App\Entity\ForgottenPassword;
use App\Entity\ResetPassword;
use App\Repository\UserRepository;
use App\Form\ForgottenPasswordType;
use App\Form\ResetPasswordType;
use Symfony\Component\Form\FormError;
use Doctrine\ORM\EntityManagerInterface;
use App\Security\UserConfirmationService;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use App\Mailer\Mailer;
class ManagePasswordController extends AbstractController
{
    private $em;
    private $encode;
    private $token;
    private $eventDispatcher;
    private $userConfirmationService;
    private $mailer;
  
     
    public function __construct(
        EntityManagerInterface $em,
        TokenGenerator $token,

        UserConfirmationService $userConfirmationService,
        Mailer $mailer
        )
    {
        $this->em=$em;
        $this->encode=$encode;
        $this->token=$token;

        $this->mailer=$mailer; 
    }
    /**
     * @Route("/managePassword/password-update", name="password_update")
     */
    public function updatePassword(Request $req)
    {
        $password=new UpdatePassword();
        $user=$this->getUser();
        $form=$this->createForm(UpdatePasswordType::class,$password);
        $form->handleRequest($req);
        if($form->isSubmitted() && $form->isValid())
        {
           if(!password_verify($password->getOldPassword(),$user->getPassword()))
           {
            $form->get('oldPassword')->addError(new FormError('password erorr'));
           }
           else{
               $user->setPassword($this->encode->encodePassword($user,$password->getNewPassword()));
               $this->em->persist($user);
               $this->em->flush();
               return $this->redirectToRoute('home');

           }
        }
        return $this->render('account/updatePassword.html.twig', [
            'form' => $form->createView()
        ]);

    }

     /**
     * @Route("/managePassword/password-forgot", name="password_forgot")
     */
    public function forgottenPassword(UserRepository $userRepo, Request $req)
    {
        // 1 enter your email inside form
        $forgottenPassword=new ForgottenPassword();
        $form=$this->createForm(ForgottenPasswordType::class,$forgottenPassword);
        $form->handleRequest($req);
      
        if($form->isSubmitted() && $form->isValid())
        {
              
            // 2 find user by email
                $user=$userRepo->findOneBy(['email'=>$forgottenPassword->getEmail()]);

            // 3 verifiy if user exist or not  if not exist redirect to (app_forgotten_password)
                if(!$user){
                    $this->addFlash('danger', 'Email Inconnu, recommence !');
                return   $this->redirectToRoute('password_forgot');
                }

            // 4 if exist generate token and set userToken 
               $user->setConfirmationToken($this->token->getRandomSecureToken());

            // 5 set enable to false 
               $user->setEnabled(false);
               $this->em->persist($user);
               $this->em->flush();
            
            // 6 send email to user and linked to resetPassowrd url()

              
                // $this->eventDispatcher->dispatch($userResetPasswordEvent,UserResetPasswordEvent::Name); 
                $this->mailer->sendConfirmationResetPassword($user);
                $this->addFlash('notice', 'Please Check Your Email !');
           
        }

        return $this->render('account/forgottenPassword.html.twig', [
            'form' => $form->createView()
        ]);

      
       
      
      
    }
/**
     * @Route("/managePassword/password-reset/{token}", name="password_reset")
     */
    public function resetPassword($token,Request $req,UserRepository userRepo)
    {
          // 1 form for reenter password 
        $resetPassword=new ResetPassword();
        $form=$this->createForm(ResetPasswordType::class,$resetPassword);
      
        $form->handleRequest($req);
        if($form->isSubmitted() && $form->isValid())
        {
         // 2 find user by token 
         // 3 verifiy if user exist or not 
         // if not exist redirect to (app_reset_password)
         // 4 if exist user setToken to null 
         // 5 set enable to true 
         // set password using UserPasswordEncoderInterface $encoder
         $user=userRepo->findOneBy(
            ['confirmationToken'=>$token]
        );

        if(!$user)
        {
            throw new error();
        }
        $user->setConfirmationToken(null);
        $user->setEnabled(true);
        $user->setPassword($this->encode->encodePassword($user,$password));

        $this->em->flush();
        // redirect to log in 
        return $this->redirectToRoute('account_login');
    }
       
         
         
        

        return $this->render('account/forgottenPassword.html.twig', [
            'form' => $form->createView()
        ]);
        
    }
}