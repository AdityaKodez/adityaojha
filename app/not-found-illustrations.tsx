import type { ReactNode } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { NOT_FOUND_EASE } from "./not-found-timing";
import styles from "./not-found-scene.module.css";

const paper = "var(--not-found-drawing-paper)";

function Drawing({ viewBox, children, lineOnly = false }: { viewBox: string; children: ReactNode; lineOnly?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width="100%"
      height="100%"
      fill="none"
      color={lineOnly ? "var(--not-found-line)" : "var(--not-found-ink)"}
      stroke="currentColor"
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

type LookingProps = {
  reaction: MotionValue<number>;
  lookX: MotionValue<number>;
  lookY: MotionValue<number>;
};

const restingArm = "M86 136C85 145 85 158 86 166C86 174 92 178 101 179L125 182C130 187 139 184 140 180C148 179 148 173 141 171C143 166 137 162 132 166L125 169L102 164L103 142";
const scratchingArm = "M86 136C76 137 73 129 77 119C81 110 91 98 99 88L112 69C109 64 114 57 120 59C122 52 129 55 128 61C134 61 132 68 127 69L120 75L97 111L103 142";

export function HikerDrawing({
  reaction, lookX, lookY, found, reducedMotion,
}: LookingProps & { found: boolean; reducedMotion: boolean }) {
  const checkTilt = useTransform(reaction, [0, 0.12, 0.28, 0.5, 0.67, 0.85, 1], [0, 10, -6, -4, 4, 8, 0]);
  const headRotate = useTransform(() => lookX.get() * 3 + checkTilt.get());
  const headY = useTransform(lookY, [-1, 1], [-1.2, 1.2]);
  const mapRotate = useTransform(reaction, [0, 0.12, 0.3, 0.6, 0.82, 1], [0, -7, -7, 3, -4, 0]);
  const arm = useTransform(reaction, [0, 0.12, 0.28, 0.37, 0.46, 0.55, 0.75, 1], [restingArm, restingArm, scratchingArm, scratchingArm, scratchingArm, scratchingArm, restingArm, restingArm]);
  const scratchRotate = useTransform(reaction, [0, 0.28, 0.34, 0.4, 0.46, 0.52, 0.6, 1], [0, 0, -2, 1, -2, 1, 0, 0]);

  return (
    <Drawing viewBox="0 0 234 284">
      {/* Backpack and rolled sleeping mat sit behind the shoulders. */}
      <path d="M69 88C53 88 43 99 36 118L21 153C12 175 24 188 51 187L76 177 89 115Z" fill={paper} />
      <path d="M46 120 30 137C23 141 19 137 18 133L30 114M37 157l11-24" />
      <path d="M40 80 83 82C96 83 97 112 83 114L39 113Z" fill={paper} />
      <path d="M68 83v28m7-27v27m7-25v23" strokeWidth="2" />
      <ellipse cx="39" cy="97" rx="17" ry="18" fill={paper} transform="rotate(15 39 97)" />
      <path d="M44 88c-13-7-20 13-8 16 8 2 12-11 5-11-4-1-5 4-3 5" strokeWidth="2.6" />
      {/* Loose trousers and a pair of slightly scuffed walking boots. */}
      <path d="m77 174 46 1 5 29-4 47-19 2-3-46-6 46-20-1-2-45Z" fill={paper} />
      <path d="m77 250-1 24c8 4 26 4 35 1l-1-7c-1-5-7-6-13-7l-1-10M106 251l-1 22C112 277 130 277 140 275L139 268C138 263 130 262 124 261L125 252" fill={paper} />
      <path d="m77 269 10 1m20 0 8 1m-36 6 31 1m5-1 20-1" strokeWidth="2.4" />
      <path d="M72 279h67m5-1h3" stroke="var(--not-found-line)" strokeWidth="2.4" />
      {/* Jacket, its strap, and the scarf are drawn separately from the map. */}
      <path d="M91 104C72 108 61 131 58 154l-5 28c14 9 34 12 50 8l17-7 4-43-9-29Z" fill={paper} />
      <path d="M92 119c-12 15-20 37-24 65m-9-5 10 4m27-47-7 42 13 3m-6 4-1 4" strokeWidth="2.6" />
      <path d="m118 114 9 18-9 27-10-4 6-27-7-11Z" fill={paper} />
      <path d="M101 88C83 84 74 94 80 112c5 15 15 30 29 29 8 0 14-7 17-14l-14-22Z" fill="var(--not-found-scarf)" />
      <path d="M83 99c0 11 11 27 25 30" strokeWidth="2.3" />
      {/* The face leans out from under a bobble hat and curly fringe. */}
      <motion.g
        initial={false}
        animate={{ rotate: found ? 10 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: NOT_FOUND_EASE }}
        style={{ transformBox: "view-box", transformOrigin: "128px 107px" }}
      >
      <motion.g style={{ rotate: headRotate, y: headY, transformBox: "view-box", transformOrigin: "128px 107px" }}>
      <path d="M112 57c-11 5-16 19-12 32l8 8c6 15 21 24 37 20 11-3 18-11 19-21l7-6-7-7-1-20Z" fill={paper} />
      <path d="M112 83c-13-7-15 12-2 13m-4-8 4 3" strokeWidth="2.6" />
      <path d="M105 67c-6-14 6-36 27-37 20-2 39 10 42 29l-35 13Z" fill={paper} />
      <path d="M115 34c-18 2-21-18-9-22 11-5 20 6 15 14" fill={paper} />
      <path d="M104 65c10-8 21-11 34-10l32 2M114 60l-1 8m9-10-1 9m10-12-1 9" strokeWidth="2.5" />
      <path d="M126 65c-5 9 3 15 10 9 3 8 11 8 15 1 0 8 10 11 15 5 8 6 17-1 12-9 8-5 4-17-5-15-3-10-16-9-18-2-7-7-17-1-16 5-6-4-12-1-13 6Z" fill={paper} />
      <circle cx="145" cy="95" r="2.3" fill="currentColor" stroke="none" />
      <path d="m157 105 3-2" strokeWidth="2.4" />
      </motion.g>
      </motion.g>
      {/* Folded map held by the near hand at its left edge and the far hand at its right edge. */}
      <motion.g style={{ rotate: mapRotate, transformBox: "view-box", transformOrigin: "137px 178px" }}>
      <path d="m136 137 30-7 32 9 28-7 2 87-31 18-32-9-34 11 5-32-4-22Z" fill={paper} />
      <path d="m166 138-1 27m1 44-1 11m32-69 1 28m0 28-1 21" stroke="var(--muted-foreground)" strokeWidth="1.5" opacity="0.45" />
      <path d="m178 147-5 7m-4 10-1 8m2 10 4 6m8 5 6 1m-36 25 4-1" strokeDasharray="5 4" strokeWidth="2.8" opacity={found ? 0.2 : 1} />
      <motion.path
        d="M178 147C165 160 164 179 177 188C187 196 196 189 205 201"
        stroke="var(--not-found-route)"
        strokeWidth="3"
        initial={false}
        animate={{ pathLength: found ? 1 : 0, opacity: found ? 1 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.45, ease: NOT_FOUND_EASE }}
      />
      <path d="m199 195 13 13m-1-15-13 16" />
      <path d="M226 157c-7-2-10 3-8 7-4 3-3 7 0 9-2 5 2 9 7 7l4-7v-11Z" fill={paper} />
      <path d="m220 162 5 1m-7 6 7 1" strokeWidth="2" />
      </motion.g>
      <motion.path d={arm} fill={paper} style={{ rotate: scratchRotate, transformBox: "view-box", transformOrigin: "92px 132px" }} />
    </Drawing>
  );
}

export function QuestionDrawing({
  reaction, found, reducedMotion,
}: { reaction: MotionValue<number>; found: boolean; reducedMotion: boolean }) {
  const redraw = useTransform(reaction, [0, 0.12, 0.6, 0.86, 1], [1, 0, 0, 1, 1]);

  return (
    <Drawing viewBox="0 0 58 72" lineOnly>
      <motion.path
        initial={false}
        animate={{ d: found ? "M35 7C35 15 35 20 35 23C35 27 35 30 35 35" : "M27 17C27 4 48 2 49 15C50 24 36 25 36 35" }}
        style={{ pathLength: found || reducedMotion ? 1 : redraw }}
        transition={{ duration: reducedMotion ? 0 : 0.24, ease: NOT_FOUND_EASE }}
        strokeWidth="4"
      />
      <circle cx="35" cy="44" r="2.6" fill="currentColor" stroke="none" />
      <path d="m10 9 5 12M8 45 3 56m17 0-9 8" />
    </Drawing>
  );
}

export function GrassDrawing() {
  return (
    <Drawing viewBox="0 0 160 85" lineOnly>
      <path d="M24 70c-2-14-7-24-15-31m16 31c2-17 9-32 18-41M25 70c-1-20-4-34-5-47M58 78c-2-10-7-18-14-22m21 22c0-15 3-28 9-40m-1 39c4-11 10-18 17-22" />
    </Drawing>
  );
}

export function SnailDrawing({ reaction, lookX, lookY }: LookingProps) {
  const bodyScaleX = useTransform(reaction, [0, 0.07, 0.2, 0.55, 0.8, 0.9, 1], [1, 0.9, 0.2, 0.2, 1.03, 1, 1]);
  const bodyScaleY = useTransform(reaction, [0, 0.07, 0.2, 0.55, 0.8, 0.9, 1], [1, 0.6, 0.3, 0.3, 1.03, 1, 1]);
  const shellY = useTransform(reaction, [0, 0.2, 0.55, 0.8, 0.9, 1], [0, 9.5, 9.5, -1.5, 0, 0]);
  const eyeX = useTransform(lookX, [-1, 1], [-2.5, 2.5]);
  const eyeY = useTransform(lookY, [-1, 1], [-1.5, 1.5]);

  return (
    <Drawing viewBox="0 0 300 155">
      <path d="M75 141h151m5 0h4" stroke="var(--not-found-line)" strokeWidth="2.6" />
      <motion.g style={{ scaleX: bodyScaleX, scaleY: bodyScaleY, transformBox: "view-box", transformOrigin: "176px 125px" }}>
      <path d="M84 91c3-8 13-8 18 0l12 23c13 8 30 7 47 7 27-1 44 5 58 18l-126 1c-8-13-11-30-9-49Z" fill={paper} />
      <path d="m87 90-9-21m19 19 2-24" stroke="var(--not-found-line)" />
      <circle cx="75" cy="61" r="10" fill={paper} />
      <circle cx="100" cy="56" r="10" fill={paper} />
      <motion.g style={{ x: eyeX, y: eyeY }}>
        <circle cx="76" cy="61" r="2.8" fill="currentColor" stroke="none" />
        <circle cx="101" cy="56" r="2.8" fill="currentColor" stroke="none" />
      </motion.g>
      <path d="m91 101 1 1m7 10 4 1" strokeWidth="2.5" />
      </motion.g>
      <motion.path d="M132 119c-8-14-3-39 12-51 15-14 39-14 54 0 15 12 20 33 10 50-10 16-32 15-44 7-16-11-14-34-1-39 13-6 28 4 24 16-3 9-15 8-17 1" fill={paper} style={{ y: shellY }} />
      <path d="m51 31-10-6m22-5-5-9m22 8-1-13M28 139c-1-9-5-15-10-18m18 17-1-20m9 21c2-8 6-14 12-17M255 139c-1-11-4-19-9-24m17 23c1-13 6-23 12-30m-4 31c6-10 13-15 20-16" stroke="var(--not-found-line)" strokeWidth="3" />
    </Drawing>
  );
}

export function PineDrawing() {
  return (
    <Drawing viewBox="0 0 205 205">
      <path d="m127 139-2 57m13-57 3 57" stroke="var(--not-found-line)" />
      <path d="M134 20c-11 16-22 30-36 42l24-4c-9 16-20 29-33 40l26-6c-9 16-19 28-31 39 14 1 25-2 37-8l-6 10 14-6 8 3 9-7 8 8-2-11c9 6 19 8 31 8-11-11-20-24-27-38l24 7c-13-13-23-26-31-41l22 5c-13-13-25-25-37-41Z" fill={paper} />
      <path d="M49 194c-1-12-6-22-13-29m21 29c-1-15 1-27 6-36m1 35c4-11 10-17 16-19M75 199c-1-5 4-8 9-6-1-9 9-12 14-5 10-14 27-3 23 10m-23 3 14 1m12-1h4" stroke="var(--not-found-line)" strokeWidth="2.8" />
    </Drawing>
  );
}

export function MoleDrawing({
  reaction, found, reducedMotion,
}: { reaction: MotionValue<number>; found: boolean; reducedMotion: boolean }) {
  const y = useTransform(reaction, [0, 0.16, 0.48, 0.82, 1], [0, 110, 110, -3, 0]);

  return (
    <Drawing viewBox="0 0 340 145">
      <motion.g style={{ y }}>
      <motion.g
        initial={false}
        animate={{ rotate: found ? 11 : 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: NOT_FOUND_EASE }}
        style={{ transformBox: "view-box", transformOrigin: "164px 104px" }}
      >
      <path d="M116 110C114 80 126 52 154 43C170 38 187 38 200 42L226 40C233 39 237 45 232 50L208 68C207 82 208 96 210 110Z" fill={paper} />
      <ellipse cx="231" cy="44" rx="7" ry="6" fill="currentColor" stroke="var(--not-found-line)" strokeWidth="1.2" />
      <circle cx="186" cy="58" r="2.3" fill="currentColor" stroke="none" />
      <path d="m160 76-7 4m9 3-6 4" strokeWidth="2.4" />
      <path d="m224 55 12 2m-10 6 11 4" stroke="var(--not-found-line)" strokeWidth="2.4" />
      </motion.g>
      </motion.g>
      <path d="M76 129c-3-6 1-12 9-11-1-9 6-16 14-11 3-10 14-9 19-2 8-9 19-7 24 3 7-7 16-6 20 3 7-8 19-7 24 1 6-12 18-14 27-5 6-9 18-5 20 5 9-4 16 2 16 10 8-3 16 2 16 9L265 150H76Z" fill="var(--not-found-paper)" stroke="none" />
      <path d="M76 129c-3-6 1-12 9-11-1-9 6-16 14-11 3-10 14-9 19-2 8-9 19-7 24 3 7-7 16-6 20 3 7-8 19-7 24 1 6-12 18-14 27-5 6-9 18-5 20 5 9-4 16 2 16 10 8-3 16 2 16 9m-194 1 6-3m188 3 9 1" stroke="var(--not-found-line)" />
      <path d="M113 108c-1-17 20-18 31-9 6 5 7 14 3 15l-7-10 1 12c-5 5-7-7-10-11l1 13c-6 4-9-9-10-13l-1 10c-2 4-6-1-8-7ZM191 108c-1-17 21-18 32-9 6 5 7 14 3 15l-7-10 1 12c-5 5-7-7-10-11l1 13c-6 4-9-9-10-13l-1 10c-2 4-7-1-9-7Z" fill={paper} strokeWidth="2.8" />
      <path d="M41 129c-5-11-11-19-20-23m29 21c-1-14-5-24-9-31m16 31c1-17 5-28 10-36m226 42c0-13-2-23-6-31m14 31c3-14 8-23 15-29m-7 29c6-9 14-13 20-13" stroke="var(--not-found-line)" strokeWidth="3" />
      <g fill="var(--not-found-line)" stroke="none">
        <ellipse cx="18" cy="132" rx="3.5" ry="2.5" />
        <ellipse cx="65" cy="143" rx="4" ry="2.5" />
        <ellipse cx="249" cy="144" rx="3.5" ry="2.5" />
      </g>
    </Drawing>
  );
}

const sleepingFoxHead = "M172 151L147 139L155 129L148 128L163 106C151 91 142 71 138 51C162 52 181 61 197 74L225 66C232 43 243 23 260 12C270 32 274 53 272 74L300 93L290 100L299 104L272 133L252 160Z";
const awakeFoxHead = "M172 151L147 139L155 129L148 128L163 106C150 87 140 58 145 35C169 41 188 51 202 66L226 58C230 35 240 14 258 4C271 26 279 47 276 68L303 88L293 95L302 99L272 133L252 160Z";

export function FoxDrawing({ reaction, perched = false }: { reaction: MotionValue<number>; perched?: boolean }) {
  const awake = useTransform(reaction, [0, 0.1, 0.3, 0.7, 0.94, 1], [0, 1, 1, 1, 0, 0]);
  const head = useTransform(awake, [0, 1], [sleepingFoxHead, awakeFoxHead]);
  const headY = useTransform(reaction, [0, 0.12, 0.28, 0.46, 0.68, 0.9, 1], [0, -8, -8, -21, -16, 0, 0]);
  const headRotate = useTransform(reaction, [0, 0.14, 0.28, 0.46, 0.68, 0.9, 1], [0, -2, 0, -3, -1.5, 0, 0]);
  const leftEye = useTransform(awake, [0, 1], ["M184 115C189 122 197 120 199 113C196 119 188 122 184 115Z", "M183 112C187 104 197 104 201 111C196 119 188 119 183 112Z"]);
  const rightEye = useTransform(awake, [0, 1], ["M238 104C242 111 250 109 252 101C248 108 242 110 238 104Z", "M237 102C241 94 251 94 255 101C250 109 242 109 237 102Z"]);
  const yawn = useTransform(reaction, [0, 0.3, 0.45, 0.57, 0.76, 1], [0, 0, 1, 1, 0, 0]);
  const jaw = useTransform(yawn, [0, 1], ["M222 157C223 158 247 158 248 159Z", "M222 157C219 178 249 181 248 159Z"]);
  const mouth = useTransform(yawn, [0, 1], ["M228 160C229 161 240 161 241 160Z", "M228 160C226 171 243 172 241 160Z"]);
  const stretch = useTransform(reaction, [0, 0.3, 0.46, 0.68, 0.9, 1], [1, 1, 1.025, 1.015, 1, 1]);
  const tailY = useTransform(yawn, [0, 1], [0, 16]);

  return (
    <Drawing viewBox={perched ? "100 0 380 186" : "0 -30 485 212"}>
      <g className={styles.foxBreath}>
      <motion.path d="M167 174c-12-31 3-64 32-84 22-15 44-22 67-26 35-34 92-45 136-25 50 23 77 66 64 107-7 23-31 34-65 35Z" fill={paper} style={{ scaleX: stretch, transformBox: "view-box", transformOrigin: "270px 180px" }} />
      <motion.g style={{ y: headY, rotate: headRotate, transformBox: "view-box", transformOrigin: "230px 145px" }}>
      <motion.path d={head} fill={paper} />
      <path d="M151 64c9 4 17 8 23 14m75-49c-7 9-11 18-13 26" strokeWidth="3" />
      <motion.path d={leftEye} fill={paper} strokeWidth="2.6" />
      <motion.path d={rightEye} fill={paper} strokeWidth="2.6" />
      <motion.g style={{ opacity: awake }} fill="currentColor" stroke="none">
        <circle cx="192" cy="111" r="2.5" />
        <circle cx="246" cy="101" r="2.5" />
      </motion.g>
      <path d="M225 150c1-8 15-10 17-2 0 5-6 10-9 10s-8-4-8-8Z" fill="currentColor" stroke="none" />
      <motion.path d={jaw} style={{ opacity: yawn }} fill={paper} strokeWidth="2.6" />
      <motion.path d={mouth} style={{ opacity: yawn }} fill="currentColor" strokeWidth="2" />
      </motion.g>
      {/* The pale tail curls under the chin and around the sleeping body. */}
      <motion.g style={{ y: tailY }}>
      <path d="M109 182c28-31 67-38 110-21 35-36 86-62 133-58 42 3 67 26 71 54 2 9-1 18-6 24" fill={paper} />
      <path d="M110 181c14-18 34-26 55-28l-4 11 19-4-2 11 22-4-3 14" strokeWidth="2.8" />
      <path d="M398 126c-5-6-15-4-15 2 0 5 7 6 9 10m-1-13c6-8 14-5 17 0m-13 5 7 9" strokeWidth="2.7" />
      </motion.g>
      </g>
      {!perched && <path d="M28 172c8 0 17 4 24 10m13-7c-4-16-11-29-21-38m29 37c1-18 5-32 12-42m-4 43c4-14 11-25 18-32" stroke="var(--not-found-line)" strokeWidth="3" />}
    </Drawing>
  );
}
