"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Wallet,
  CheckCircle2,
  Video,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  Home,
  TrendingUp,
  ListTodo,
  Calendar,
  Send,
  Banknote,
  CreditCard,
  HelpCircle,
  Copy,
  Share2,
  X,
  QrCode,
  Clock,
  Eye,
} from "lucide-react"

interface UserData {
  id: string
  firstName: string
  lastName?: string
  username?: string
  balance: number
  tasksCompleted: number
  videosWatched: number
  referrals: number
  workDays: number
  hasDeposited: boolean
  lastDailyClaimTime?: number
  transactions: Transaction[]
  videoWatchTimes?: { [key: string]: number }
  specialOffersCompleted?: string[]
}

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "task" | "video" | "referral" | "daily" | "special"
  amount: number
  method?: string
  timestamp: number
  status: "completed" | "pending"
}

interface TaskDetail {
  id: number
  title: string
  description: string
  requirements: string[]
  reward: number
}

interface VideoDetail {
  id: number
  title: string
  description: string
  duration: string
  reward: number
}

interface SpecialOffer {
  id: string
  title: string
  description: string
  reward: number
  icon: string
  color: string
  requirements: string[]
}

export default function HomePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    "home" | "invite" | "profit" | "tasks" | "videos" | "daily" | "transfer" | "cash" | "payments" | "faq"
  >("home")
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [depositMethod, setDepositMethod] = useState<"crypto" | "bank" | null>(null)
  const [depositAmount, setDepositAmount] = useState("")
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawalMethod, setWithdrawalMethod] = useState<string | null>(null)
  const [withdrawalAmount, setWithdrawalAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState<string>("")
  const [canClaimDaily, setCanClaimDaily] = useState(false)
  const [viewingTask, setViewingTask] = useState<TaskDetail | null>(null)
  const [viewingVideo, setViewingVideo] = useState<VideoDetail | null>(null)
  const [videoCountdowns, setVideoCountdowns] = useState<{ [key: number]: string }>({})

  const taskDetails: TaskDetail[] = [
    {
      id: 1,
      title: "Telegram ալիք բաժանորդագրություն",
      description: "Բաժանորդագրվեք մեր պաշտոնական Telegram ալիքին և ստացեք ֏2,000",
      requirements: ["Բացեք Telegram ալիքը", "Սեղմեք Subscribe կոճակը", "Վերադարձեք և հաստատեք"],
      reward: 2000,
    },
    {
      id: 2,
      title: "Instagram էջ հետևում",
      description: "Հետևեք մեր Instagram էջին և ստացեք ֏2,000",
      requirements: ["Բացեք Instagram էջը", "Սեղմեք Follow կոճակը", "Վերադարձեք և հաստատեք"],
      reward: 2000,
    },
    {
      id: 3,
      title: "Facebook էջ like",
      description: "Like արեք մեր Facebook էջը և ստացեք ֏2,000",
      requirements: ["Բացեք Facebook էջը", "Սեղմեք Like կոճակը", "Վերադարձեք և հաստատեք"],
      reward: 2000,
    },
    {
      id: 4,
      title: "YouTube ալիք բաժանորդագրություն",
      description: "Բաժանորդագրվեք մեր YouTube ալիքին և ստացեք ֏2,000",
      requirements: ["Բացեք YouTube ալիքը", "Սեղմեք Subscribe կոճակը", "Վերադարձեք և հաստատեք"],
      reward: 2000,
    },
    {
      id: 5,
      title: "Կիսվել ընկերների հետ",
      description: "Կիսվեք RichLab-ի մասին 3 ընկերների հետ և ստացեք ֏2,000",
      requirements: ["Պատճենեք հղումը", "Ուղարկեք 3 ընկերների", "Սպասեք հաստատմանը"],
      reward: 2000,
    },
  ]

  const videoDetails: VideoDetail[] = [
    {
      id: 1,
      title: "Ինչպե՞ս վաստակել օնլայն",
      description: "Սովորեք ինչպե՞ս վաստակել գումար օնլայն հեշտ և արագ",
      duration: "5:30",
      reward: 2300,
    },
    {
      id: 2,
      title: "Կրիպտոարժույթների ներածություն",
      description: "Հասկացեք կրիպտոարժույթների աշխարհը և ինչպե՞ս օգտագործել դրանք",
      duration: "8:15",
      reward: 2300,
    },
    {
      id: 3,
      title: "Հրավիրումների ռազմավարություն",
      description: "Սովորեք ինչպե՞ս ավելի շատ մարդկանց հրավիրել և վաստակել",
      duration: "6:45",
      reward: 2300,
    },
    {
      id: 4,
      title: "Ֆինանսական հմտություններ",
      description: "Բարելավեք ձեր ֆինանսական գրագիտությունը",
      duration: "10:20",
      reward: 2300,
    },
  ]

  const specialOffers: SpecialOffer[] = [
    {
      id: "vip_task",
      title: "VIP Առաջադրանք",
      description: "Կատարեք բոլոր սոցիալական մեդիա առաջադրանքները մեկ օրում",
      reward: 50000,
      icon: "⭐",
      color: "yellow",
      requirements: [
        "Կատարեք 5 սոցիալական մեդիա առաջադրանք",
        "Բոլորը պետք է կատարվեն 24 ժամում",
        "Հաստատեք յուրաքանչյուրը",
      ],
    },
    {
      id: "weekly_challenge",
      title: "Շաբաթական մարտահրավեր",
      description: "Կատարեք 50 առաջադրանք շաբաթվա ընթացքում",
      reward: 100000,
      icon: "🏆",
      color: "orange",
      requirements: ["Կատարեք 50 առաջադրանք", "Դիտեք 30 տեսանյութ", "Հրավիրեք 5 նոր օգտատեր"],
    },
    {
      id: "monthly_bonus",
      title: "Ամսական բոնուս",
      description: "Ակտիվ մնացեք ամբողջ ամիսը",
      reward: 250000,
      icon: "🎁",
      color: "red",
      requirements: [
        "Մուտք գործեք 30 օր անընդմեջ",
        "Կատարեք նվազագույնը 100 առաջադրանք",
        "Վաստակեք նվազագույնը ֏500,000",
      ],
    },
  ]

  useEffect(() => {
    if (!user || !user.videoWatchTimes) return

    const updateVideoCountdowns = () => {
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000
      const newCountdowns: { [key: number]: string } = {}

      videoDetails.forEach((video) => {
        const lastWatchTime = user.videoWatchTimes?.[video.id] || 0
        const timeSinceWatch = now - lastWatchTime

        if (timeSinceWatch >= twentyFourHours) {
          newCountdowns[video.id] = "Պատրաստ է!"
        } else {
          const timeRemaining = twentyFourHours - timeSinceWatch
          const hours = Math.floor(timeRemaining / (60 * 60 * 1000))
          const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000))
          const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000)
          newCountdowns[video.id] = `${hours}ժ ${minutes}ր ${seconds}վ`
        }
      })

      setVideoCountdowns(newCountdowns)
    }

    updateVideoCountdowns()
    const interval = setInterval(updateVideoCountdowns, 1000)

    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tg = (window as any).Telegram?.WebApp

      if (tg) {
        tg.ready()
        tg.expand()

        const telegramUser = tg.initDataUnsafe?.user
        const startParam = tg.initDataUnsafe?.start_param

        if (telegramUser) {
          const storedUser = localStorage.getItem(`user_${telegramUser.id}`)

          if (storedUser) {
            setUser(JSON.parse(storedUser))
          } else {
            const newUser: UserData = {
              id: telegramUser.id.toString(),
              firstName: telegramUser.first_name,
              lastName: telegramUser.last_name,
              username: telegramUser.username,
              balance: 0,
              tasksCompleted: 0,
              videosWatched: 0,
              referrals: 0,
              workDays: 0,
              hasDeposited: false,
              lastDailyClaimTime: 0,
              transactions: [],
              videoWatchTimes: {},
              specialOffersCompleted: [],
            }
            localStorage.setItem(`user_${telegramUser.id}`, JSON.stringify(newUser))
            setUser(newUser)

            if (startParam && startParam.startsWith("ref_")) {
              const referrerId = startParam.replace("ref_", "")
              if (referrerId !== telegramUser.id.toString()) {
                const referrerData = localStorage.getItem(`user_${referrerId}`)
                if (referrerData) {
                  const referrer = JSON.parse(referrerData)
                  referrer.balance += 4000
                  referrer.referrals += 1
                  referrer.transactions = referrer.transactions || []
                  referrer.transactions.push({
                    id: Date.now().toString(),
                    type: "referral",
                    amount: 4000,
                    timestamp: Date.now(),
                    status: "completed",
                  })
                  localStorage.setItem(`user_${referrerId}`, JSON.stringify(referrer))
                }
              }
            }
          }
        } else {
          const demoUser: UserData = {
            id: "demo",
            firstName: "Demo",
            lastName: "User",
            username: "demouser",
            balance: 10000,
            tasksCompleted: 5,
            videosWatched: 3,
            referrals: 2,
            workDays: 7,
            hasDeposited: false,
            lastDailyClaimTime: 0,
            transactions: [],
            videoWatchTimes: {},
            specialOffersCompleted: [],
          }
          setUser(demoUser)
        }
      } else {
        const demoUser: UserData = {
          id: "demo",
          firstName: "Demo",
          lastName: "User",
          username: "demouser",
          balance: 10000,
          tasksCompleted: 5,
          videosWatched: 3,
          referrals: 2,
          workDays: 7,
          hasDeposited: false,
          lastDailyClaimTime: 0,
          transactions: [],
          videoWatchTimes: {},
          specialOffersCompleted: [],
        }
        setUser(demoUser)
      }

      setIsLoading(false)
    }
  }, [])

  const updateUser = (updates: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem(`user_${user.id}`, JSON.stringify(updatedUser))
      console.log("[v0] User data saved to localStorage:", updatedUser)
    }
  }

  const addTransaction = (type: Transaction["type"], amount: number, method?: string) => {
    if (!user) return

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount,
      method,
      timestamp: Date.now(),
      status: "completed",
    }

    const updatedTransactions = [...(user.transactions || []), newTransaction]
    updateUser({ transactions: updatedTransactions })
  }

  const claimDailyBonus = () => {
    if (!user || !canClaimDaily) return

    let bonus = 1000
    if (user.workDays >= 15) {
      bonus = 5000
    } else if (user.workDays >= 8) {
      bonus = 3000
    } else if (user.workDays >= 4) {
      bonus = 2000
    }

    addTransaction("daily", bonus)

    updateUser({
      balance: user.balance + bonus,
      workDays: user.workDays + 1,
      lastDailyClaimTime: Date.now(),
    })

    alert(`Շնորհավորում ենք! Դուք ստացաք ֏${bonus.toLocaleString()} ամենօրյա բոնուս`)
  }

  const handleDeposit = () => {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) {
      alert("Խնդրում ենք մուտքագրել վավեր գումար")
      return
    }

    const amount = Number.parseFloat(depositAmount)

    addTransaction("deposit", amount, depositMethod === "crypto" ? "DASH" : "Bank Transfer")

    updateUser({
      balance: user!.balance + amount,
      hasDeposited: true,
    })

    alert(`Ավանդը հաջողությամբ կատարվել է: Ավելացվել է ֏${amount.toLocaleString()}`)
    setShowDepositModal(false)
    setDepositMethod(null)
    setDepositAmount("")
  }

  const handleWithdrawal = () => {
    if (!withdrawalAmount || Number.parseFloat(withdrawalAmount) < 125000) {
      alert("Նվազագույն գումարը ֏125,000 է")
      return
    }

    if (Number.parseFloat(withdrawalAmount) > user!.balance) {
      alert("Անբավարար մնացորդ")
      return
    }

    if (!user!.hasDeposited) {
      alert("Դեպոզիտ չարած օգտատերերը չեն կարող կատարել withdrawal")
      return
    }

    const amount = Number.parseFloat(withdrawalAmount)

    addTransaction("withdrawal", amount, withdrawalMethods.find((m) => m.id === withdrawalMethod)?.name)

    updateUser({
      balance: user!.balance - amount,
    })

    alert(`Դուրսբերումը հաջողությամբ ուղարկվել է ${withdrawalMethods.find((m) => m.id === withdrawalMethod)?.name}`)
    setShowWithdrawalModal(false)
    setWithdrawalMethod(null)
    setWithdrawalAmount("")
  }

  const withdrawalMethods = [
    {
      id: "dash",
      name: "DASH",
      badge: "PRO",
      description: "Պրոֆեսիոնալ ելքագրման համակարգ",
      features: ["Ակնթարթային", "Անվտանգ", "Պրեմիում"],
      icon: "🚀",
      active: true,
      tax: "0% Հարկ",
    },
    { id: "easypay", name: "EasyPay", description: "Մոբայլ վճարում", active: true },
    { id: "idram", name: "Idram", description: "Էլեկտրոնային դրամապանակ", active: true },
    { id: "arca", name: "ArCa", description: "Հայկական քարտային համակարգ", active: true },
    { id: "ameriabank", name: "ԱմերիաԲանկ", description: "Բանկային փոխանցում", active: true },
    { id: "ardshinbank", name: "ԱրդշինԲանկ", description: "Բանկային փոխանցում", active: true },
    { id: "acba", name: "ԱԿԲԱ Բանկ", description: "Բանկային փոխանցում", active: true },
    { id: "converse", name: "Կոնվերս Բանկ", description: "Բանկային փոխանցում", active: true },
    { id: "btc", name: "Bitcoin (BTC)", description: "Կրիպտո ելքագրում", active: true },
    { id: "usdt", name: "USDT (TRC20)", description: "Կրիպտո ելքագրում", active: true },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareReferralLink = () => {
    const tg = (window as any).Telegram?.WebApp
    const referralLink = `https://t.me/richlab_bot?start=ref_${user?.id}`
    const shareText = `🎁 Միացիր RichLab-ին և վաստակիր գումար օնլայն!\n\n💰 Ստացիր ֏4,000 բոնուս գրանցման համար\n📱 Կատարիր առաջադրանքներ և վաստակիր ավելին\n\n${referralLink}`

    if (tg) {
      tg.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`,
      )
    } else {
      copyToClipboard(referralLink)
    }
  }

  const canWatchVideo = (videoId: number): boolean => {
    if (!user || !user.videoWatchTimes) return true
    const lastWatchTime = user.videoWatchTimes[videoId] || 0
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    return now - lastWatchTime >= twentyFourHours
  }

  const completeVideoWatch = (video: VideoDetail) => {
    if (!user) return

    const videoWatchTimes = { ...(user.videoWatchTimes || {}), [video.id]: Date.now() }

    addTransaction("video", video.reward)

    updateUser({
      balance: user.balance + video.reward,
      videosWatched: user.videosWatched + 1,
      workDays: user.workDays + 1,
      videoWatchTimes,
    })

    alert(`Շնորհավորում ենք! Դուք վաստակեցիք ֏${video.reward.toLocaleString()}`)
    setViewingVideo(null)
  }

  const completeTask = (task: TaskDetail) => {
    if (!user) return

    addTransaction("task", task.reward)

    updateUser({
      balance: user.balance + task.reward,
      tasksCompleted: user.tasksCompleted + 1,
      workDays: user.workDays + 1,
    })

    alert(`Շնորհավորում ենք! Դուք վաստակեցիք ֏${task.reward.toLocaleString()}`)
    setViewingTask(null)
  }

  const completeSpecialOffer = (offer: SpecialOffer) => {
    if (!user) return

    const specialOffersCompleted = [...(user.specialOffersCompleted || []), offer.id]

    addTransaction("special", offer.reward)

    updateUser({
      balance: user.balance + offer.reward,
      specialOffersCompleted,
    })

    alert(`Շնորհավորում ենք! Դուք ավարտեցիք "${offer.title}" և վաստակեցիք ֏${offer.reward.toLocaleString()}`)
  }

  const isSpecialOfferCompleted = (offerId: string): boolean => {
    return user?.specialOffersCompleted?.includes(offerId) || false
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Բեռնում է...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">RichLab</h1>
          <p className="text-muted-foreground mb-6">Խնդրում ենք բացել այս հավելվածը Telegram-ի միջոցով</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="bg-gradient-to-br from-primary via-primary/90 to-accent p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground">RichLab</h1>
            <p className="text-primary-foreground/80 text-sm">Բարև, {user.firstName}!</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground font-bold text-lg">
            {user.firstName[0]}
          </div>
        </div>

        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur p-4 border-green-500/30 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              D
            </div>
            <div className="flex-1">
              <div className="text-sm text-green-100 mb-1">Այսօրվա վաստակ</div>
              <div className="text-3xl font-bold text-white">֏8,000</div>
              <div className="text-xs text-green-100 mt-1">+15% նախորդ օրվա համեմատ</div>
            </div>
            <div className="text-green-400">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </Card>

        <Card className="bg-card/95 backdrop-blur p-6 border-0 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Ձեր հաշվեկշիռը</span>
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div className="text-4xl font-bold text-foreground mb-4">֏{user.balance.toLocaleString()}</div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setShowDepositModal(true)}
            >
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              Ավանդ
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowWithdrawalModal(true)}
              disabled={user.balance < 125000 || user.workDays < 15}
            >
              <ArrowUpFromLine className="w-4 h-4 mr-2" />
              Դուրսբերում
            </Button>
          </div>
          {user.workDays < 15 && (
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Դուրսբերման համար պահանջվում է 15 օր աշխատանք ({user.workDays}/15)
            </p>
          )}
        </Card>
      </div>

      <div className="px-4">
        {activeTab === "home" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Գլխավոր էջ</h2>

            <div className="grid grid-cols-3 gap-3">
              <Card className="p-4 text-center shadow-md">
                <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{user.tasksCompleted}</div>
                <div className="text-xs text-muted-foreground">Առաջադրանքներ</div>
              </Card>
              <Card className="p-4 text-center shadow-md">
                <Video className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{user.videosWatched}</div>
                <div className="text-xs text-muted-foreground">Տեսանյութեր</div>
              </Card>
              <Card className="p-4 text-center shadow-md">
                <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{user.referrals}</div>
                <div className="text-xs text-muted-foreground">Հրավիրածներ</div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Արագ գործողություններ</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setActiveTab("tasks")} className="h-20 flex-col gap-2">
                  <ListTodo className="w-6 h-6" />
                  <span className="text-sm">Առաջադրանքներ</span>
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("videos")} className="h-20 flex-col gap-2">
                  <Video className="w-6 h-6" />
                  <span className="text-sm">Տեսանյութեր</span>
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("invite")} className="h-20 flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <span className="text-sm">Հրավիրել</span>
                </Button>
                <Button variant="outline" onClick={() => setActiveTab("daily")} className="h-20 flex-col gap-2">
                  <Calendar className="w-6 h-6" />
                  <span className="text-sm">Ամենօրյա</span>
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Վերջին գործողությունները</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Առաջադրանք կատարված</div>
                      <div className="text-xs text-muted-foreground">2 ժամ առաջ</div>
                    </div>
                  </div>
                  <div className="text-green-500 font-semibold">+֏2,000</div>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Video className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Տեսանյութ դիտված</div>
                      <div className="text-xs text-muted-foreground">5 ժամ առաջ</div>
                    </div>
                  </div>
                  <div className="text-green-500 font-semibold">+֏2,300</div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Նոր հրավիրված</div>
                      <div className="text-xs text-muted-foreground">1 օր առաջ</div>
                    </div>
                  </div>
                  <div className="text-green-500 font-semibold">+֏2,000</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "invite" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Հրավիրել ընկերներ</h2>
            <Card className="p-6 bg-gradient-to-br from-secondary/20 to-accent/20 border-secondary">
              <h3 className="font-bold text-lg text-foreground mb-2">Վաստակեք ավելին!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Հրավիրեք ընկերներին և ստացեք ֏4,000 յուրաքանչյուր հրավիրածի համար + 10% նրանց վաստակից
              </p>
              <div className="bg-background/80 p-4 rounded-lg mb-4 border-2 border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-primary uppercase">Ձեր հղումը</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="bg-primary/10 px-2 py-1 rounded">ID: {user.id}</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg mb-3 border border-border">
                  <p className="font-mono text-sm text-foreground break-all select-all">
                    https://t.me/richlab_bot?start=ref_{user.id}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => copyToClipboard(`https://t.me/richlab_bot?start=ref_${user.id}`)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? "Պատճենված!" : "Պատճենել"}
                  </Button>
                  <Button className="w-full bg-secondary hover:bg-secondary/90" onClick={shareReferralLink}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Կիսվել
                  </Button>
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                <p className="text-xs text-foreground">
                  💡 <strong>Ինչպե՞ս աշխատում է:</strong> Երբ ձեր ընկերը մուտք է գործում ձեր հղումով, դուք ավտոմատ
                  ստանում եք ֏4,000 բոնուս և 10% նրանց բոլոր վաստակներից։
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-purple-100 mb-1">Ընդհանուր հրավիրածներից</div>
                  <div className="text-3xl font-bold text-white">֏4,000+</div>
                  <div className="text-xs text-purple-100 mt-1">2 հրավիրված օգտատեր</div>
                </div>
                <div className="w-16 h-16 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-purple-500/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">֏4,000</div>
                  <div className="text-xs text-purple-100">Բոնուս</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">֏400+</div>
                  <div className="text-xs text-purple-100">Կոմիսիոն (10%)</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Ձեր հրավիրածները ({user.referrals})</h3>
              {user.referrals > 0 ? (
                <div className="space-y-3">
                  {Array.from({ length: user.referrals }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          U{i + 1}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Օգտատեր {i + 1}</div>
                          <div className="text-xs text-muted-foreground">
                            Ակտիվ • Վաստակել է ֏{(2000 + Math.floor(Math.random() * 1000)).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-500 font-semibold">+֏2,000</div>
                        <div className="text-xs text-muted-foreground">
                          +֏{Math.floor(200 + Math.random() * 100)} (10%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Դեռ հրավիրածներ չկան</p>
              )}
            </Card>
          </div>
        )}

        {activeTab === "profit" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Մեծ շահույթ</h2>
            <Card className="p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Հատուկ առաջարկներ</h3>
                <p className="text-muted-foreground">Վաստակեք ավելի շատ հատուկ առաջադրանքներով</p>
              </div>

              <div className="space-y-3">
                {specialOffers.map((offer) => {
                  const isCompleted = isSpecialOfferCompleted(offer.id)
                  return (
                    <Card
                      key={offer.id}
                      className={`p-4 border-2 ${
                        offer.color === "yellow"
                          ? "border-yellow-500/50"
                          : offer.color === "orange"
                            ? "border-orange-500/50"
                            : "border-red-500/50"
                      } ${isCompleted ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-bold text-lg text-foreground flex items-center gap-2">
                            {offer.title}
                            {isCompleted && (
                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">Ավարտված</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">{offer.description}</div>
                          <div className="space-y-1">
                            {offer.requirements.map((req, idx) => (
                              <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                {req}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="text-2xl ml-4">{offer.icon}</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div
                          className={`text-2xl font-bold ${
                            offer.color === "yellow"
                              ? "text-yellow-500"
                              : offer.color === "orange"
                                ? "text-orange-500"
                                : "text-red-500"
                          }`}
                        >
                          ֏{offer.reward.toLocaleString()}
                        </div>
                        <Button
                          className={`${
                            offer.color === "yellow"
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : offer.color === "orange"
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-red-500 hover:bg-red-600"
                          } text-white`}
                          onClick={() => completeSpecialOffer(offer)}
                          disabled={isCompleted}
                        >
                          {isCompleted ? "Ավարտված" : "Սկսել"}
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground mb-4">Առաջադրանքների կենտրոն</h2>
            {taskDetails.map((task) => (
              <Card key={task.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span className="font-bold">֏{task.reward.toLocaleString()}</span>
                    </div>
                  </div>
                  <Button onClick={() => setViewingTask(task)} className="bg-primary hover:bg-primary/90">
                    <Eye className="w-4 h-4 mr-2" />
                    Դիտել
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "videos" && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground mb-4">Տեսանյութեր</h2>
            {videoDetails.map((video) => {
              const canWatch = canWatchVideo(video.id)
              const countdown = videoCountdowns[video.id] || "Պատրաստ է!"

              return (
                <Card key={video.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{video.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-primary font-bold">֏{video.reward.toLocaleString()}</span>
                        <span className="text-muted-foreground">• {video.duration}</span>
                        {!canWatch && (
                          <span className="flex items-center gap-1 text-orange-500">
                            <Clock className="w-3 h-3" />
                            {countdown}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => setViewingVideo(video)}
                      className="bg-accent hover:bg-accent/90"
                      disabled={!canWatch}
                    >
                      {canWatch ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Դիտել
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Սպասեք
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )
            })}

            <Card className="p-4 bg-blue-500/10 border-blue-500/20">
              <p className="text-sm text-foreground text-center">
                ℹ️ Յուրաքանչյուր տեսանյութ կարող եք դիտել մեկ անգամ 24 ժամում։ Սպասեք հաջորդ դիտման համար։
              </p>
            </Card>
          </div>
        )}

        {activeTab === "daily" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Ամենօրյա բոնուսներ</h2>
            <Card className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Ամենօրյա մուտք</h3>
                <p className="text-muted-foreground">Մուտք գործեք ամեն օր և ստացեք բոնուսներ</p>
              </div>

              <Card className="p-4 mb-6 bg-background/50 border-2 border-primary/30">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    {canClaimDaily ? "Հաջորդ բոնուսը պատրաստ է!" : "Հաջորդ բոնուսը"}
                  </div>
                  <div className={`text-3xl font-bold ${canClaimDaily ? "text-green-500" : "text-primary"}`}>
                    {timeUntilNextClaim}
                  </div>
                  {!canClaimDaily && <div className="text-xs text-muted-foreground mt-1">մինչև հաջորդ հավաքումը</div>}
                </div>
              </Card>

              <div className="grid grid-cols-7 gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center ${
                      day <= user.workDays ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs mb-1">Օր</div>
                    <div className="font-bold">{day}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">Օր 1-3</span>
                  <span className="font-bold text-primary">֏1,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">Օր 4-7</span>
                  <span className="font-bold text-primary">֏2,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">Օր 8-14</span>
                  <span className="font-bold text-primary">֏3,000</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-foreground">Օր 15+</span>
                  <span className="font-bold text-primary">֏5,000</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={claimDailyBonus}
                disabled={!canClaimDaily}
              >
                {canClaimDaily ? "Ստանալ այսօրվա բոնուսը" : `Սպասեք ${timeUntilNextClaim}`}
              </Button>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-foreground text-center">
                  ℹ️ Ամենօրյա բոնուսը կարող եք ստանալ մեկ անգամ 24 ժամում։ Յուրաքանչյուր օգտատեր ունի մեկ հնարավորություն
                  օրական։
                </p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "transfer" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Գումարային փոխանցում</h2>
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Փոխանցել գումար օգտատիրոջը</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Ստացողի ID</label>
                  <Input type="text" placeholder="Մուտքագրեք օգտատիրոջ ID-ն" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Գումարը (֏)</label>
                  <Input type="number" placeholder="Մուտքագրեք գումարը" />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90">Փոխանցել</Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Փոխանցումների պատմություն</h3>
              <p className="text-center text-muted-foreground py-8">Փոխանցումներ չկան</p>
            </Card>
          </div>
        )}

        {activeTab === "cash" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Կանխիկ</h2>
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💵</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Կանխիկ վճարումներ</h3>
                <p className="text-sm text-muted-foreground">Ստացեք ձեր գումարը կանխիկ</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-foreground mb-2">📍 Մեր գրասենյակներ</p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Երևան, Մաշտոցի 12</p>
                  <p>• Գյումրի, Վարդանանց 45</p>
                  <p>• Վանաձոր, Տիգրան Մեծի 23</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mb-4">
                <p className="text-sm text-foreground text-center">
                  ℹ️ Կանխիկ ստանալու համար նախապես զանգահարեք և պայմանավորվեք
                </p>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90">Զանգահարել</Button>
            </Card>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Վճարումներ</h2>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Ավանդ</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setDepositMethod("crypto")
                    setShowDepositModal(true)
                  }}
                >
                  Linen/DASH
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setDepositMethod("bank")
                    setShowDepositModal(true)
                  }}
                >
                  Բանկային փոխանցում
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setDepositMethod("crypto")
                    setShowDepositModal(true)
                  }}
                >
                  Կրիպտո
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Դուրսբերում</h3>
              <div className="bg-muted/50 p-4 rounded-lg mb-4">
                <p className="text-sm text-foreground mb-2">
                  <strong>Հասանելի մնացորդ:</strong> ֏{user.balance.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Նվազագույն դուրսբերում: ֏125,000</p>
                <p className="text-sm text-muted-foreground">Պահանջվող աշխատանքային օրեր: 15 ({user.workDays}/15)</p>
              </div>
              <Button
                className="w-full"
                onClick={() => setShowWithdrawalModal(true)}
                disabled={user.balance < 125000 || user.workDays < 15}
              >
                Դուրսբերել միջոցները
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Վճարումների պատմություն</h3>
              {user.transactions && user.transactions.length > 0 ? (
                <div className="space-y-3">
                  {user.transactions
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-foreground capitalize">
                            {transaction.type === "deposit" && "Ավանդ"}
                            {transaction.type === "withdrawal" && "Դուրսբերում"}
                            {transaction.type === "task" && "Առաջադրանք"}
                            {transaction.type === "video" && "Տեսանյութ"}
                            {transaction.type === "referral" && "Հրավիրում"}
                            {transaction.type === "daily" && "Ամենօրյա բոնուս"}
                            {transaction.type === "special" && "Հատուկ առաջարկ"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.timestamp).toLocaleDateString("hy-AM")}
                            {transaction.method && ` • ${transaction.method}`}
                          </div>
                        </div>
                        <div
                          className={`font-semibold ${
                            transaction.type === "withdrawal" ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {transaction.type === "withdrawal" ? "-" : "+"}֏{transaction.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Վճարումներ չկան</p>
              )}
            </Card>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground mb-4">Հաճախակի տրվող հարցեր</h2>

            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Ինչպե՞ս սկսել վաստակել:
                  </h3>
                  <p className="text-sm text-muted-foreground pl-7">
                    Կատարեք առաջադրանքներ, դիտեք տեսանյութեր և հրավիրեք ընկերներին: Յուրաքանչյուր գործողության համար
                    կստանաք վարձատրություն:
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Ե՞րբ կարող եմ դուրսբերել գումարը:
                  </h3>
                  <p className="text-sm text-muted-foreground pl-7">
                    Դուրսբերման համար անհրաժեշտ է նվազագույնը ֏125,000 մնացորդ և 15 օր աշխատանք:
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Ինչքա՞ն եմ վաստակում հրավիրածներից:
                  </h3>
                  <p className="text-sm text-muted-foreground pl-7">
                    Յուրաքանչյուր հրավիրածի համար ստանում եք ֏4,000 + 10% նրանց վաստակից:
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Անվտա՞նգ է այս հավելվածը:
                  </h3>
                  <p className="text-sm text-muted-foreground pl-7">
                    Այո, մենք օգտագործում ենք Telegram-ի անվտանգ նույնականացում և բոլոր գործարքները պաշտպանված են:
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Ինչպե՞ս կապվել աջակցության հետ:
                  </h3>
                  <p className="text-sm text-muted-foreground pl-7">
                    Կարող եք գրել մեզ @richlab_support հասցեով կամ զանգահարել +374 XX XXX XXX:
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/10 border-primary/20">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-20">Չգտա՞ք պատասխանը:</h3>
                <p className="text-sm text-muted-foreground mb-4">Կապվեք մեր աջակցության թիմի հետ</p>
                <Button className="bg-primary hover:bg-primary/90">Կապվել աջակցության հետ</Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="overflow-x-auto">
          <div className="flex gap-1 p-2 min-w-max">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "home" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">Գլխավոր</span>
            </button>
            <button
              onClick={() => setActiveTab("invite")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "invite" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">Հրավեր</span>
            </button>
            <button
              onClick={() => setActiveTab("profit")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "profit" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <TrendingUp className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">Շահույթ</span>
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "tasks" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <ListTodo className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">Առաջադր.</span>
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "videos" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Video className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">Տեսանյութ</span>
            </button>
            <button
              onClick={() => setActiveTab("daily")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "daily" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">Ամենօրյա</span>
            </button>
            <button
              onClick={() => setActiveTab("transfer")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "transfer" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Send className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">Փոխանց.</span>
            </button>
            <button
              onClick={() => setActiveTab("cash")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "cash" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Banknote className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">Կանխիկ</span>
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "payments" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <CreditCard className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">Վճարումներ</span>
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[70px] ${
                activeTab === "faq" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <HelpCircle className="w-5 h-5 mb-1" />
              <span className="text-xs whitespace-nowrap">FAQ</span>
            </button>
          </div>
        </div>
      </div>

      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Ավանդ</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowDepositModal(false)
                    setDepositMethod(null)
                    setDepositAmount("")
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {!depositMethod ? (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 bg-transparent"
                    onClick={() => setDepositMethod("crypto")}
                  >
                    <div className="text-left">
                      <div className="font-semibold">Linen/DASH</div>
                      <div className="text-sm text-muted-foreground">Կրիպտո ավանդ</div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 bg-transparent"
                    onClick={() => setDepositMethod("bank")}
                  >
                    <div className="text-left">
                      <div className="font-semibold">Բանկային փոխանցում</div>
                      <div className="text-sm text-muted-foreground">Ինեկո Բանկ / ACBA Բանկ</div>
                    </div>
                  </Button>
                </div>
              ) : depositMethod === "crypto" ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <QrCode className="w-32 h-32 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Սկանավորեք QR կոդը</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Ավանդի հասցե</label>
                    <div className="flex gap-2">
                      <Input value="XdW2GWqqzrRAw21MA6voyhRxy8bF7fQVP6" readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard("XdW2GWqqzrRAw21MA6voyhRxy8bF7fQVP6")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Գումարը (֏)</label>
                    <Input
                      type="number"
                      placeholder="Մուտքագրեք գումարը"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                    <p className="text-sm text-foreground mb-2">
                      <strong>Նվազագույն ավանդ:</strong> 0.15 DASH
                    </p>
                    <p className="text-sm text-foreground">
                      <strong>Բոնուս:</strong> 300% բոնուս 0.3967683 DASH-ից
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>1. Պատճենեք ավանդի հասցեն</p>
                    <p>2. Ուղարկեք DASH ձեր դրամապանակից</p>
                    <p>3. Սպասեք blockchain հաստատմանը</p>
                    <p>4. Գումարը կավելանա ձեր հաշվին</p>
                  </div>

                  <Button className="w-full" onClick={handleDeposit}>
                    Հաստատել ավանդը
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Ինեկո Բանկ</p>
                      <p className="text-sm text-muted-foreground">Հաշիվ: 1234567890123456</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">ACBA Բանկ</p>
                      <p className="text-sm text-muted-foreground">Հաշիվ: 9876543210987654</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Գումարը (֏)</label>
                    <Input
                      type="number"
                      placeholder="Մուտքագրեք գումարը"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                    />
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                    <p className="text-sm text-foreground">ℹ️ Փոխանցումից հետո կապվեք աջակցության հետ հաստատման համար</p>
                  </div>

                  <Button className="w-full" onClick={handleDeposit}>
                    Հաստատել ավանդը
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Դուրսբերում</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowWithdrawalModal(false)
                    setWithdrawalMethod(null)
                    setWithdrawalAmount("")
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground mb-2">
                  <strong>Հասանելի մնացորդ:</strong> ֏{user.balance.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Նվազագույն դուրսբերում: ֏125,000</p>
                <p className="text-sm text-muted-foreground">Պահանջվող աշխատանքային օրեր: 15 ({user.workDays}/15)</p>
              </div>

              {!user.hasDeposited && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-500 font-medium">
                    ⚠️ Դեպոզիտ չարած օգտատերերը չեն կարող կատարել withdrawal ձեր պրոֆիլը ակտիվ չի
                  </p>
                </div>
              )}

              {!withdrawalMethod ? (
                <div className="space-y-3">
                  {withdrawalMethods.map((method) => (
                    <Button
                      key={method.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 bg-transparent"
                      onClick={() => setWithdrawalMethod(method.id)}
                      disabled={!user.hasDeposited}
                    >
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{method.name}</span>
                          {method.badge && (
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                        {method.tax && <div className="text-xs text-green-500 mt-1">{method.tax}</div>}
                      </div>
                      {method.icon && <span className="text-2xl">{method.icon}</span>}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      {withdrawalMethod === "dash" && "DASH հասցե"}
                      {withdrawalMethod === "easypay" && "EasyPay համար"}
                      {withdrawalMethod === "idram" && "Idram համար"}
                      {withdrawalMethod === "arca" && "Քարտի համար"}
                      {(withdrawalMethod === "ameriabank" ||
                        withdrawalMethod === "ardshinbank" ||
                        withdrawalMethod === "acba" ||
                        withdrawalMethod === "converse") &&
                        "Հաշվեհամար"}
                      {withdrawalMethod === "btc" && "Bitcoin հասցե"}
                      {withdrawalMethod === "usdt" && "USDT (TRC20) հասցե"}
                    </label>
                    <Input type="text" placeholder="Մուտքագրեք հասցեն/համարը" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Գումարը (֏)</label>
                    <Input
                      type="number"
                      placeholder="Նվազագույնը ֏125,000"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                    />
                  </div>

                  <Button className="w-full" onClick={handleWithdrawal} disabled={!user.hasDeposited}>
                    Ելքագրել գումար
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {viewingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">{viewingTask.title}</h2>
                <Button variant="ghost" size="icon" onClick={() => setViewingTask(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Նկարագրություն</h3>
                  <p className="text-sm text-muted-foreground">{viewingTask.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Պահանջներ</h3>
                  <div className="space-y-2">
                    {viewingTask.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Վարձատրություն</div>
                    <div className="text-3xl font-bold text-primary">֏{viewingTask.reward.toLocaleString()}</div>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => completeTask(viewingTask)}>
                  Կատարել առաջադրանքը
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {viewingVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">{viewingVideo.title}</h2>
                <Button variant="ghost" size="icon" onClick={() => setViewingVideo(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <Video className="w-16 h-16 text-muted-foreground" />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Նկարագրություն</h3>
                  <p className="text-sm text-muted-foreground">{viewingVideo.description}</p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Տևողություն: {viewingVideo.duration}</span>
                  <span className="text-primary font-bold">֏{viewingVideo.reward.toLocaleString()}</span>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                  <p className="text-sm text-foreground text-center">
                    ℹ️ Դիտեք տեսանյութը մինչև վերջ և ստացեք վարձատրությունը։ Հաջորդ դիտումը հասանելի կլինի 24 ժամ հետո։
                  </p>
                </div>

                <Button
                  className="w-full bg-accent hover:bg-accent/90"
                  onClick={() => completeVideoWatch(viewingVideo)}
                >
                  Ավարտել դիտումը և ստանալ ֏{viewingVideo.reward.toLocaleString()}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
