import { prisma } from "../models/prisma";

export async function checkAndAwardBadges(
  userId: string
): Promise<{ id: string; name: string; imageUrl: string }[]> {
  const newBadges: { id: string; name: string; imageUrl: string }[] = [];

  const [authenticCount, postCount, educationCount, userBadgeIds, allBadges] =
    await Promise.all([
      prisma.productVerification.count({ where: { userId, status: "AUTHENTIC" } }),
      prisma.communityPost.count({ where: { userId } }),
      // Conta conteúdos educativos completados (adicionar tabela futuramente)
      Promise.resolve(0),
      prisma.userBadge
        .findMany({ where: { userId }, select: { badgeId: true } })
        .then((ub) => new Set(ub.map((b) => b.badgeId))),
      prisma.badge.findMany(),
    ]);

  const totalBadgesNoSistema = allBadges.length;

  for (const badge of allBadges) {
    // Pula badges que o usuário já tem
    if (userBadgeIds.has(badge.id)) continue;

    const earned = evaluateTrigger(badge, {
      authenticCount,
      postCount,
      educationCount,
      currentBadgeCount: userBadgeIds.size,
      totalBadgesNoSistema,
    });

    if (earned) {
      await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
      userBadgeIds.add(badge.id); // atualiza o set local para o próximo loop
      newBadges.push({ id: badge.id, name: badge.name, imageUrl: badge.imageUrl });
    }
  }

  return newBadges;
}

function evaluateTrigger(
  badge: { trigger: string; threshold: number },
  counts: {
    authenticCount: number;
    postCount: number;
    educationCount: number;
    currentBadgeCount: number;
    totalBadgesNoSistema: number;
  }
): boolean {
  switch (badge.trigger) {
    case "FIRST_VERIFICATION":
      return counts.authenticCount >= 1;

    case "VERIFICATIONS_COUNT":
      return counts.authenticCount >= badge.threshold;

    case "COMMUNITY_POST":
      return counts.postCount >= badge.threshold;

    case "EDUCATION_COMPLETE":
      return counts.educationCount >= badge.threshold;

    case "STREAK_DAYS":
      // TODO: implementar streak (verificações em dias consecutivos)
      // Por enquanto libera por tempo de cadastro
      return false;

    case "ALL_BADGES":
      // "Lenda da Autenticidade" — conquistou todos os outros badges
      // threshold = total de badges antes deste
      return counts.currentBadgeCount >= badge.threshold;

    default:
      return false;
  }
}
