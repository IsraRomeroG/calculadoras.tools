import {
  calculateAttendanceCore,
  type AttendanceInput,
  type AttendanceProjection,
  type AttendanceResult as CoreAttendanceResult,
} from "./attendance-core";

export interface AttendanceExample {
  id: "regular" | "recover" | "no-margin" | "impossible" | "unknown";
  label: string;
  values: {
    totalClasses: string;
    mode: "attended" | "absences";
    attendedClasses: string;
    absences: string;
    requiredPercent: string;
    remainingClasses: string;
  };
}

interface AttendanceCopyLabels {
  heading: string;
  inputMode: string;
  attendedMode: string;
  absencesMode: string;
  requiredMinimum: string;
  completedClasses: string;
  attendedClasses: string;
  accumulatedAbsences: string;
  remainingClasses: string;
  notProvided: string;
  currentAttendance: string;
  currentSituation: string;
  margin: string;
  finalProjection: string;
  finalTotal: string;
  maximumFinalAbsences: string;
  futureAbsencesAvailable: string;
  exceededAbsences: string;
  requiredRemainingAttendances: string;
  maximumFinalPercentage: string;
  theoreticalRecovery: string;
  impossible: string;
}

export interface AttendanceLocaleConfig {
  locale: string;
  canonicalPath: string;
  examples: readonly AttendanceExample[];
  classWord: [singular: string, plural: string];
  absenceWord: [singular: string, plural: string];
  currentMeets: string;
  currentBelow: string;
  projectionLabels: Record<AttendanceProjection["status"], string>;
  messages: {
    unknown: (actual: string) => string;
    pendingProjection: string;
    finishedMeets: (minimum: string) => string;
    finishedBelow: (minimum: string) => string;
    impossible: (remaining: LocalizedCount, maximum: string, needed: LocalizedCount) => string;
    guaranteed: (minimum: string, total: LocalizedCount) => string;
    possibleBelow: (
      needed: LocalizedCount,
      remaining: LocalizedCount,
      minimum: string,
    ) => string;
    possibleAvailable: (
      available: LocalizedCount,
      remaining: LocalizedCount,
      minimum: string,
    ) => string;
    possibleAll: (remaining: LocalizedCount) => string;
    impossibleNeeded: (remaining: LocalizedCount) => string;
    exceededAbsences: (exceeded: LocalizedCount) => string;
    guaranteeCondition: string;
    temporaryMarginCondition: string;
    unknownRecovery: string;
    theoreticalRecovery: (remaining: LocalizedCount) => string;
    finishedRecovery: string;
    alreadyRecovered: string;
    impossibleRecovery: string;
    roundingBelow: (minimum: string) => string;
    smallDeficit: string;
    smallMargin: string;
  };
  copy: AttendanceCopyLabels;
}

export interface AttendancePresentation {
  actionMessage: string;
  conditionMessage: string;
  currentStatusLabel: string;
  projectionLabel: string;
  availabilityLabel: string;
  neededLabel: string;
  exceededLabel: string;
  marginLabel: string;
  recoveryLabel: string;
  currentRoundingNotice: string;
  finalRoundingNotice: string;
}

export interface LocalizedCount {
  value: number;
  formatted: string;
}

export type AttendanceResult = CoreAttendanceResult & {
  presentation: AttendancePresentation;
};

export function createAttendanceAdapter(config: AttendanceLocaleConfig) {
  const numberFormatter = new Intl.NumberFormat(config.locale, {
    maximumFractionDigits: 2,
  });
  const exactPercentFormatter = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  });
  const countFormatter = new Intl.NumberFormat(config.locale, {
    maximumFractionDigits: 0,
  });

  function formatNumber(value: number): string {
    assertFinite(value);
    return numberFormatter.format(normalizeNegativeZero(round(value, 2)));
  }

  function formatPercent(value: number): string {
    return `${formatNumber(value)}%`;
  }

  function formatRequiredPercent(resultOrValue: CoreAttendanceResult | number): string {
    const value =
      typeof resultOrValue === "number" ? resultOrValue : resultOrValue.requiredPercent;
    assertFinite(value);
    return `${exactPercentFormatter.format(value)}%`;
  }

  function formatCount(value: number): string {
    assertFinite(value);
    return countFormatter.format(value);
  }

  function formatSignedNumber(value: number): string {
    assertFinite(value);
    const rounded = normalizeNegativeZero(round(value, 2));
    return `${rounded > 0 ? "+" : ""}${numberFormatter.format(rounded)}`;
  }

  function plural(value: number, words: [string, string]): string {
    return Math.abs(value) === 1 ? words[0] : words[1];
  }

  function localizedCount(value: number): LocalizedCount {
    return { value, formatted: formatCount(value) };
  }

  function calculateAttendance(input: AttendanceInput): AttendanceResult {
    const core = calculateAttendanceCore(input);
    return { ...core, presentation: present(core) };
  }

  function present(result: CoreAttendanceResult): AttendancePresentation {
    const projection = result.projection;
    const minimum = formatRequiredPercent(result);
    let actionMessage: string;
    let conditionMessage = "";
    let availabilityLabel: string;
    let neededLabel: string;

    switch (projection.status) {
      case "unknown":
        actionMessage = config.messages.unknown(formatPercent(result.currentPercent));
        availabilityLabel = config.messages.pendingProjection;
        neededLabel = config.messages.pendingProjection;
        break;
      case "finished_meets":
        actionMessage = config.messages.finishedMeets(minimum);
        availabilityLabel = formatCount(0);
        neededLabel = formatCount(0);
        break;
      case "finished_below":
        actionMessage = config.messages.finishedBelow(minimum);
        availabilityLabel = formatCount(0);
        neededLabel = formatCount(projection.requiredAttendancesFromRemaining);
        break;
      case "impossible":
        actionMessage = config.messages.impossible(
          localizedCount(projection.remainingClasses),
          formatPercent(projection.maxPossiblePercent),
          localizedCount(projection.requiredAttendancesFromRemaining),
        );
        availabilityLabel = formatCount(0);
        neededLabel = config.messages.impossibleNeeded(
          localizedCount(projection.remainingClasses),
        );
        break;
      case "guaranteed":
        actionMessage = config.messages.guaranteed(
          minimum,
          localizedCount(projection.finalTotalClasses),
        );
        conditionMessage = [
          config.messages.guaranteeCondition,
          projection.availableAbsences > 0
            ? config.messages.temporaryMarginCondition
            : "",
        ]
          .filter(Boolean)
          .join(" ");
        availabilityLabel = formatCount(projection.availableAbsences);
        neededLabel = formatCount(0);
        break;
      case "possible":
        if (result.currentStatus === "below") {
          actionMessage = config.messages.possibleBelow(
            localizedCount(projection.requiredAttendancesFromRemaining),
            localizedCount(projection.remainingClasses),
            minimum,
          );
          if (projection.availableAbsences > 0) {
            conditionMessage = config.messages.temporaryMarginCondition;
          }
        } else if (projection.availableAbsences > 0) {
          actionMessage = config.messages.possibleAvailable(
            localizedCount(projection.availableAbsences),
            localizedCount(projection.remainingClasses),
            minimum,
          );
          conditionMessage = config.messages.temporaryMarginCondition;
        } else {
          actionMessage = config.messages.possibleAll(
            localizedCount(projection.remainingClasses),
          );
        }
        availabilityLabel = formatCount(projection.availableAbsences);
        neededLabel = `${formatCount(projection.requiredAttendancesFromRemaining)}/${formatCount(
          projection.remainingClasses,
        )}`;
        break;
    }

    return {
      actionMessage,
      conditionMessage,
      currentStatusLabel:
        result.currentStatus === "meets" ? config.currentMeets : config.currentBelow,
      projectionLabel: config.projectionLabels[projection.status],
      availabilityLabel,
      neededLabel,
      exceededLabel:
        projection.status !== "unknown" && projection.exceededAbsences > 0
          ? config.messages.exceededAbsences(
              localizedCount(projection.exceededAbsences),
            )
          : "",
      marginLabel: formatMargin(result.marginPoints),
      recoveryLabel: formatRecovery(result),
      currentRoundingNotice: getRoundingNotice(
        result.currentPercent,
        result.currentStatus,
        minimum,
      ),
      finalRoundingNotice:
        projection.status !== "unknown" && projection.status === "impossible"
          ? getRoundingNotice(
              projection.maxPossiblePercent,
              "below",
              minimum,
            )
          : "",
    };
  }

  function formatMargin(value: number): string {
    const rounded = normalizeNegativeZero(round(value, 2));
    if (value !== 0 && rounded === 0) {
      return value < 0 ? config.messages.smallDeficit : config.messages.smallMargin;
    }
    return formatSignedNumber(value);
  }

  function getRoundingNotice(
    percentage: number,
    status: "meets" | "below",
    minimum: string,
  ): string {
    if (status === "below" && formatPercent(percentage) === minimum) {
      return config.messages.roundingBelow(minimum);
    }
    return "";
  }

  function formatRecovery(result: CoreAttendanceResult): string {
    const recovery = result.consecutiveClassesToRecover;
    if (recovery === null) {
      return config.messages.impossibleRecovery;
    }
    if (recovery === 0) {
      return config.messages.alreadyRecovered;
    }
    const projection = result.projection;
    const base = `${formatCount(recovery)} ${plural(recovery, config.classWord)}`;
    if (projection.status === "unknown") {
      return `${base}. ${config.messages.unknownRecovery}`;
    }
    if (projection.remainingClasses === 0) {
      return `${base}. ${config.messages.finishedRecovery}`;
    }
    if (recovery > projection.remainingClasses) {
      return `${base}. ${config.messages.theoreticalRecovery(
        localizedCount(projection.remainingClasses),
      )}`;
    }
    return base;
  }

  function buildAttendanceSummary(result: AttendanceResult): string {
    const projection = result.projection;
    const lines = [
      config.copy.heading,
      `${config.copy.inputMode}: ${
        result.inputMode === "attended"
          ? config.copy.attendedMode
          : config.copy.absencesMode
      }`,
      `${config.copy.requiredMinimum}: ${formatRequiredPercent(result)}`,
      `${config.copy.completedClasses}: ${formatCount(result.totalClasses)}`,
      `${config.copy.attendedClasses}: ${formatCount(result.attendedClasses)}`,
      `${config.copy.accumulatedAbsences}: ${formatCount(result.currentAbsences)}`,
      `${config.copy.currentAttendance}: ${formatPercent(result.currentPercent)}`,
      `${config.copy.currentSituation}: ${result.presentation.currentStatusLabel}`,
      `${config.copy.margin}: ${result.presentation.marginLabel}`,
      `${config.copy.remainingClasses}: ${
        projection.status === "unknown"
          ? config.copy.notProvided
          : formatCount(projection.remainingClasses)
      }`,
      `${config.copy.finalProjection}: ${result.presentation.projectionLabel}`,
    ];

    if (projection.status !== "unknown") {
      lines.push(
        `${config.copy.finalTotal}: ${formatCount(projection.finalTotalClasses)}`,
        `${config.copy.maximumFinalAbsences}: ${formatCount(projection.maximumFinalAbsences)}`,
        `${config.copy.futureAbsencesAvailable}: ${formatCount(projection.availableAbsences)}`,
        `${config.copy.exceededAbsences}: ${formatCount(projection.exceededAbsences)}`,
        `${config.copy.requiredRemainingAttendances}: ${formatCount(
          projection.requiredAttendancesFromRemaining,
        )}`,
        `${config.copy.maximumFinalPercentage}: ${formatPercent(
          projection.maxPossiblePercent,
        )}`,
      );
    }

    lines.push(
      `${config.copy.theoreticalRecovery}: ${result.presentation.recoveryLabel}`,
      result.presentation.actionMessage,
    );
    if (result.presentation.conditionMessage) {
      lines.push(result.presentation.conditionMessage);
    }
    if (result.presentation.currentRoundingNotice) {
      lines.push(result.presentation.currentRoundingNotice);
    }
    if (result.presentation.finalRoundingNotice) {
      lines.push(result.presentation.finalRoundingNotice);
    }
    return lines.join("\n");
  }

  return {
    canonicalPath: config.canonicalPath,
    examples: config.examples,
    calculateAttendance,
    buildAttendanceSummary,
    formatAttendanceNumber: formatNumber,
    formatAttendancePercent: formatPercent,
    formatRequiredAttendancePercent: formatRequiredPercent,
    formatSignedAttendanceNumber: formatSignedNumber,
    formatAttendanceCount: formatCount,
  };
}

function round(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function normalizeNegativeZero(value: number): number {
  return Object.is(value, -0) ? 0 : value;
}

function assertFinite(value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError("Value must be finite.");
  }
}
