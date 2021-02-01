/**
     * One manager has Many user.
     * @OneToMany(targetEntity="User", mappedBy="manager")
     */
    private $userByManager;

    /**
     * Many user have One manager.
     * @ManyToOne(targetEntity="User", inversedBy="userByManager")
     * @JoinColumn(name="manager_id", referencedColumnName="id")
     */
    private $manager;
    // ...

    public function __construct() {
        $this->userByManager = new \Doctrine\Common\Collections\ArrayCollection();
       // .....
    }


public function getManager(){
    return $this->manager;
}
public function setManager(User $manager){
    return $this->manager=$manager;
}
    public function addUserByManager(User $userByManager): self
    {
        if (!$this->userByManager->contains($comment)) {
            $this->userByManager[] = $userByManager;
            $userByManager->setManager($this);
        }

        return $this;
    }

    public function removeUserByManager(User $userByManager): self
    {
        if ($this->userByManager->contains($userByManager)) {
            $this->userByManager->removeElement($userByManager);
            // set the owning side to null (unless already changed)
            if ($userByManager->getManager() === $this) {
                $userByManager->setManager(null);
            }
        }

        return $this;
    }